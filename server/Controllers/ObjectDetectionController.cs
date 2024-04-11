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
        // Load class names corresponding to COCO dataset
        private string[] cocoClassNames = new string[]
        {
            // Your class names here...
        };

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
                using var predictor = new YoloV8("../server/MLModels/yolov8n-oiv7.onnx");

                // Perform object detection on the provided image file
                var result = await predictor.DetectAsync(file.OpenReadStream());

                // Parse the JSON data
                var jsonString = JsonConvert.SerializeObject(result);
                var detectionResult = JsonConvert.DeserializeObject<DetectionResult>(jsonString);

                // Extract class name from the first detected object
                string? className = detectionResult?.Boxes?.Count > 0 ? detectionResult.Boxes[0].Class?.Name : "Unknown";

                // Return the class name
                return Ok(className);
            }
            catch (Exception ex)
            {
                // Handle exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Define class to represent the detection result
        public class DetectionResult
        {
            public List<Box>? Boxes { get; set; }
            // Other properties as needed...
        }

        // Define class to represent a detected object
        public class Box
        {
            public ClassInfo? Class { get; set; }
            public float Confidence { get; set; }
            // Other properties as needed...
        }

        // Define class to represent class information
        public class ClassInfo
        {
            public int Id { get; set; }
            public string? Name { get; set; }
            // Other properties as needed...
        }
    }
}
