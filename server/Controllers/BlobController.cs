using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Migrations;
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
        public async Task<IActionResult> ListAllBlolbs()
        {
            var result = await _blobFileService.ListAsync();
            return Ok(result);
        }

        [HttpGet("users/{googleUserId}/images")]
        public async Task<IActionResult> GetUserImages(string googleUserId)
        {
            if (string.IsNullOrWhiteSpace(googleUserId))
            {
                return BadRequest("GoogleUserId is missing or empty.");
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserGoogleId == googleUserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

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


        // API endpoint to store the user image with a specific caption
        // POST api/values
        [HttpPost("users/{googleUserId}/upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file, string googleUserId, string caption)
        {
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

            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserGoogleId == googleUserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var result = await _blobFileService.UploadAsync(file, googleUserId);

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

        // POST api/values
        [HttpPost("users/save-bounding-box")]
        public async Task<IActionResult> SaveBoundingBox(BoundingBoxDTO boundingBoxDTO)
        {
            if (boundingBoxDTO == null ||
                boundingBoxDTO.imageID < 0 ||
                boundingBoxDTO.xMin < 0 || boundingBoxDTO.xMax < 0 ||
                boundingBoxDTO.yMin < 0 || boundingBoxDTO.yMax < 0 ||
                string.IsNullOrWhiteSpace(boundingBoxDTO.label))
            {
                return BadRequest("Invalid input.");
            }

            var image = await _db.Images.FirstOrDefaultAsync(i => i.ImageId == boundingBoxDTO.imageID);
            if (image == null)
            {
                return NotFound("Image Does not Exist int DB");
            }

            var boundinBox = new BoundingBox
            {
                ImageId = image.ImageId,
                XMin = boundingBoxDTO.xMin,
                YMin = boundingBoxDTO.yMin,
                XMax = boundingBoxDTO.xMax,
                YMax = boundingBoxDTO.yMax,
                Label = boundingBoxDTO.label,
                Message = boundingBoxDTO.message
            };
            _db.BoundingBoxes.Add(boundinBox);
            await _db.SaveChangesAsync();

            return Ok("Succesfully Saved Bounding Box in Database");
        }

        //Api to Download Images From Blob Storage
        // GET api/values/5
        [HttpGet]
        [Route("fileName")]
        public async Task<IActionResult> DownloadImage(string fileName)
        {
            var result = await _blobFileService.DownloadAsync(fileName);
            return File(result.Content, result.ContentType, result.Name);
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
