using System;
using System.Drawing;
using Azure;
using Azure.Storage;
using Azure.Storage.Blobs;
using server.DTOs;

namespace server.Services;
public class BlobFileService
{

    private readonly string _storageAccount;
    private readonly string _key;
    private readonly string _containerName;
    private readonly BlobContainerClient _filesContainer;


    public BlobFileService(IConfiguration configuration)

{
        _storageAccount = configuration["BlobStorageAccount"] ?? throw new InvalidOperationException("BlobStorageAccount configuration is missing");
        _key = configuration["BlobKey"] ?? throw new InvalidOperationException("BlobKey configuration is missing");
        _containerName = configuration["BlobContainerName"] ?? throw new InvalidOperationException("BlobContainerName configuration is missing");


        var credential = new StorageSharedKeyCredential(_storageAccount, _key);
        var blobUri = $"https://{_storageAccount}.blob.core.windows.net";
        var blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);
        _filesContainer = blobServiceClient.GetBlobContainerClient(_containerName);

    }



    //Listing all available blobs Async
    public async Task<List<BlobDTO>> ListAsync()
    {
        List<BlobDTO> files = new List<BlobDTO>();

        try
        {
            await foreach (var file in _filesContainer.GetBlobsAsync())
            {
                string uri = _filesContainer.Uri.ToString();
                var name = file.Name;
                var fullUri = $"{uri}/{name}";

                files.Add(new BlobDTO
                {
                    Uri = fullUri,
                    Name = name,
                    ContentType = file.Properties.ContentType
                });
            }
         
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        

        }
        return files;


    }

    public async Task<BlobResponseDTO> UploadAsync(IFormFile blob)
    {
        BlobResponseDTO response = new();
        try
        {
            if (!IsImage(blob))
            {
                response.Status = $"File {blob.FileName} is not an image.";
                response.Error = true;
                return response;
            }

            BlobClient client = _filesContainer.GetBlobClient(blob.FileName);

            await using (Stream? data = blob.OpenReadStream())
            {
                await client.UploadAsync(data);
            }

            response.Status = $"File {blob.FileName} Uploaded Successfully";
            response.Error = false;
            response.Blob.Uri = client.Uri.AbsoluteUri;
            response.Blob.Name = client.Name;
        }
        catch (RequestFailedException ex)
        {
            response.Status = $"Error: {ex.Message}";
            response.Error = true;
        }
        catch (Exception ex) // Catch other exceptions
        {
            response.Status = $"Error: {ex.Message}";
            response.Error = true;
            Console.WriteLine(ex);
        }
        return response;
    }

    public async Task<BlobDTO?> DownloadAsync(string blobFilename)
    {
        try
        {
            BlobClient file = _filesContainer.GetBlobClient(blobFilename);

            if (await file.ExistsAsync())
            {
                var data = await file.OpenReadAsync();
                Stream blobContent = data;

                var content = await file.DownloadContentAsync();

                string name = blobFilename;
                string contentType = content.Value.Details.ContentType;

                return new BlobDTO { Content = blobContent, Name = name, ContentType = contentType };
            }
            else
            {
                return null;
            }
        }
        catch (RequestFailedException ex) // Catching specific Azure.Storage.Blobs.RequestFailedException
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
        catch (Exception ex) 
        {
            Console.WriteLine($"Error: {ex.Message}");
        }

        return null;
    }

    public async Task<BlobResponseDTO> DeleteAsync(string blobFilename)
    {
        try
        {
            BlobClient file = _filesContainer.GetBlobClient(blobFilename);
            await file.DeleteAsync();

            return new BlobResponseDTO { Error = false, Status = $"File:{blobFilename} has been successfully deleted." };
        }
        catch (RequestFailedException ex) { 
            Console.WriteLine($"Error: {ex.Message}");
            return new BlobResponseDTO { Error = true, Status = $"Error: Failed to delete {blobFilename}." };
        }
        catch (Exception ex) { 
            Console.WriteLine($"Error: {ex.Message}");
            return new BlobResponseDTO { Error = true, Status = $"Error: Failed to delete {blobFilename}." };
        }
    }

    //Helper Function to chek if uploaded file is a image
    private bool IsImage(IFormFile file)
    {
        string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff" };
        string fileExtension = Path.GetExtension(file.FileName).ToLower();

        return allowedExtensions.Contains(fileExtension);
    }

}
