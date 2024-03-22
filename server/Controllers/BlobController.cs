
//Controler used to manage upload, delete and update of images to Azure Blob Stroage 

using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Services;

namespace server.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    public class BlobController : Controller
    {
        private readonly BlobFileService _blobFileService;
        private readonly AacSargikDbContext _db;

        public BlobController(BlobFileService blobFileService, AacSargikDbContext db)
        {
            _blobFileService = blobFileService;
            _db = db;

        }

        //Api to list all files in the Blob Storage
        // GET: api/values
        [HttpGet]
        public async Task <IActionResult> ListAllBlolbs()
        {
            var result = await _blobFileService.ListAsync();
            return Ok(result);
        }

        [HttpGet("users/{googleUserId}/images")]
        public async Task<IActionResult> GetUserImages(string googleUserId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserGoogleId == googleUserId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var imageUris = await _db.Images
                .Where(i => i.Id == user.Id)
                .Select(i => i.ImageUri)
                .ToListAsync();

            var imageUrlsWithSasToken = new List<string>();
            foreach (var uri in imageUris)
            {
                var sasToken = _blobFileService.GenerateSasToken(uri);
                imageUrlsWithSasToken.Add(sasToken);
            }

            return Ok(imageUrlsWithSasToken);
        }


        // API to upload Images to Blob Storage
        // POST api/values
        [HttpPost("users/{googleUserId}/upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file, string googleUserId)
        {


            Console.WriteLine(googleUserId);

            if (string.IsNullOrEmpty(googleUserId))
            {
                return BadRequest("GoogleUserId claim is missing.");
            }

            // Get the user ID from the database corresponding to the Google user ID
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserGoogleId == googleUserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
           
            // Upload the image to Blob Storage
            var result = await _blobFileService.UploadAsync(file,googleUserId);

            // Associate the image with the user
            var image = new Image
            {
                Id = user.Id,
                ImageUri = result.Blob.Uri,
                ImageWidth = null,
                ImageHeight = null
            };
            _db.Images.Add(image);
            await _db.SaveChangesAsync();

            return Ok(result);
        }


        //Api to Download Images From Blob Storage
        // GET api/values/5
        [HttpGet]
        [Route("fileName")]
        public async Task <IActionResult> DownloadImage(string fileName)
        {
            var result = await _blobFileService.DownloadAsync(fileName);
            return File(result.Content,result.ContentType,result.Name);
        }

  
        // Api to Delete Images/filse given a file name
        // DELETE api/values/5
        [HttpDelete]
        [Route("fileName")]
        public async Task<IActionResult> DeleteImage(string fileName)
        {
            var result = await _blobFileService.DeleteAsync(fileName);
            return Ok(result);
        }
    }
}

