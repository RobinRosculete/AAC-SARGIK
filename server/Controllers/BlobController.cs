using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Models;
using server.Services;


namespace server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class BlobController : Controller
    {
        private readonly BlobFileService _blobFileService;
        private readonly DbService _dbService;
        private readonly AacSargikDbContext _db;

        public BlobController(AacSargikDbContext db, BlobFileService blobFileService,DbService dbService)
        {
            _blobFileService = blobFileService;
            _dbService = dbService;
            _db = db;
        }

        //Api to list all files in the Blob Storage
        // GET: api/values
        [HttpGet]
        public async Task<IActionResult> ListAllBlolbs()
        {
            try
            {
                var result = await _blobFileService.ListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //Api end point that returns all the image URI's of a user by googleID
        [HttpGet("users/{googleUserId}/images")]
        public async Task<IActionResult> GetUserImages(string googleUserId)
        {
            if (string.IsNullOrWhiteSpace(googleUserId))
            {
                return BadRequest("GoogleUserId is missing or empty.");
            }

            try
            {
                var user = await _db.Users.FirstOrDefaultAsync(u => u.UserGoogleId == googleUserId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                //Querring db for all iamge URI
                var images = await _db.Images
                    .Where(i => i.Id == user.Id) // Assuming there's a UserId property in your Image entity
                    .Select(i => new ImageCaptionDTO
                    {
                        ImageID = i.ImageId, // Include the ImageId in the response
                        ImageUri = $"{i.ImageUri}?{_blobFileService.GenerateSasToken()}",
                        ImageCaption = i.Caption
                    })
                    .ToListAsync();

                return Ok(images);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // API endpoint to store the user image with a specific caption
        // POST api/values
        [HttpPost("users/{googleUserId}/upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file, string googleUserId, string caption)
        {
            //Input error checking
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            if (string.IsNullOrWhiteSpace(googleUserId))
            {
                return BadRequest("GoogleUserId claim is missing.");
            }

            if (string.IsNullOrWhiteSpace(caption))
            {
                return BadRequest("Caption is missing.");
            }

            try
            {
                var user = await _db.Users.FirstOrDefaultAsync(u => u.UserGoogleId == googleUserId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var result = await _blobFileService.UploadAsync(file, googleUserId);

                // Storing image URI in database for specific use
                var image = new Image
                {
                    Id = user.Id,
                    ImageUri = result.Blob.Uri,
                    ImageWidth = null,
                    ImageHeight = null,
                    Caption = caption
                };
                _db.Images.Add(image);
                await _db.SaveChangesAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

 
        //Api to Download Images From Blob Storage
        // GET api/values/5
        [HttpGet]
        [Route("fileName")]
        public async Task<IActionResult> DownloadImage(string fileName)
        {
            try
            {
                var result = await _blobFileService.DownloadAsync(fileName);
                return File(result.Content, result.ContentType, result.Name);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Api to Delete Images from blob and also all database associated information for that Image (Bouding Boxes and labes)
        // DELETE api/values/5
        [HttpDelete("images/{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageID)
        {
            try
            {

                //Storing the imageUri Before Deletging
                string imageUri = _dbService.GetImageUriById(imageID);

                //Deleting image from db and Bounding Boxes of the image
                _dbService.DeleteImageAndBoundingBoxes(imageID);

                //Deletging Image From blob Storage
                var result = await _blobFileService.DeleteAsync(imageUri);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
