using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    public class BoundingBoxController : Controller
    {
        private readonly AacSargikDbContext _db;

        public BoundingBoxController(AacSargikDbContext db)
        {
            _db = db;
        }

        // GET api/boundingbox/images/{imageId}/bounding-boxes
        [HttpGet("images/{imageId}/bounding-boxes")]
        public async Task<IActionResult> GetBoundingBoxesForImage(int imageId)
        {
            try
            {
                var boundingBoxes = await _db.BoundingBoxes
                    .Where(b => b.ImageId == imageId)
                    .ToListAsync();

                return Ok(boundingBoxes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("users/save-bounding-box")]
        public async Task<IActionResult> SaveBoundingBox([FromBody] BoundingBoxDTO boundingBoxDTO)
        {
            if (boundingBoxDTO == null ||
                boundingBoxDTO.imageID < 0 ||
                boundingBoxDTO.xMin < 0 || boundingBoxDTO.xMax < 0 ||
                boundingBoxDTO.yMin < 0 || boundingBoxDTO.yMax < 0 ||
                boundingBoxDTO.label.Length <= 0 || boundingBoxDTO.message.Length <= 0)
            {
                return BadRequest("Invalid input.");
            }

            try
            {
                var image = await _db.Images.FirstOrDefaultAsync(i => i.ImageId == boundingBoxDTO.imageID);
                if (image == null)
                {
                    return NotFound("Image Does not Exist in DB");
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

                return Ok(new { message = "Successfully saved bounding box in the database." });

            }
            catch (Exception ex)
            {
                // Handle exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
