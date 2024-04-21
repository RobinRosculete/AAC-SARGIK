using Compunet.YoloV8;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObjectDetectionController : ControllerBase
    {


        // POST api/<ObjectDetection>/detectImage
        [HttpPost("detectImage")]
        public async Task<IActionResult> DetectImage(IFormFile file)
        {
            try
            {
                
                // Ensure that an image file is provided
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No image file provided.");
                }

                // Load the YOLOv8 model
                const string model_path = "../server/MLModels/yolov8s-coco.onnx";
                using var predictor = new YoloV8(model_path);

                // Perform object detection on the provided image file
                var result = await predictor.DetectAsync(file.OpenReadStream());

                // Extract class names from the detected objects
                HashSet<string> classNames = new HashSet<string>();
                foreach (var box in result.Boxes)
                {
                    classNames.Add(box.Class?.Name ?? "Unknown");
                }

                // Return the array of unique class names
                return Ok(classNames.ToList());
            }
            catch (Exception ex)
            {
                // Handle exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
