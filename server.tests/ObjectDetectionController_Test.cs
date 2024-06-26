using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Controllers;


namespace server.tests
{
    public class ObjectDetectionController_Test
    {
        /// <summary>
        /// Tests for the DetectImage() method in the ObjectDetectionController.
        /// Note: Update the file paths in DetectImage_ShouldReturnListOfStrings_WhenCorrectFileIsProvided() 
        /// and DetectImage_ShouldReturnInternalServerError_WhenIncorrectFileTypeIsProvided() to match your local machine setup.
        /// </summary>

        [Fact]
        public async Task DetectImage_ShouldReturnBadRequest_WhenNoFileIsProvided()
        {
            // Arrange
            var controller = new ObjectDetectionController();

            // Act
            var result = await controller.DetectImage(null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No image file provided.", badRequestResult.Value);

        }

        [Fact]
        public async Task DetectImage_ShouldReturnListOfStrings_WhenCorrectFileIsProvided()
        {
            // Arrange
            var controller = new ObjectDetectionController();

            //Change path on local machine
            var filePath = "/Users/Robin1/Desktop/Scoala/Anul 5/Spring/COMP490/AAC-SARGIK/server.tests/TestImages/banana-test-image.png";
            using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var formFile = new FormFile(stream, 0, stream.Length, null, Path.GetFileName(stream.Name))
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png"
            };

            // Act
            var result = await controller.DetectImage(formFile);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var classNames = Assert.IsType<List<string>>(okResult.Value);
            Assert.Equal("banana", classNames[0]); // Expected Detected class
        
        }

        [Fact]
        public async Task DetectImage_ShouldReturnInternalServerError_WhenIncorrectFileTypeIsProvided()
        {
            // Arrange
            var controller = new ObjectDetectionController();

            //Change path on local machine
            var filePath = "/Users/Robin1/Desktop/Scoala/Anul 5/Spring/COMP490/AAC-SARGIK/server.tests/TestImages/TEST-TEST.txt";
            using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var formFile = new FormFile(stream, 0, stream.Length, null, Path.GetFileName(stream.Name))
            {
                Headers = new HeaderDictionary(),
                ContentType = "text/txt"
            };

            // Act
            var result = await controller.DetectImage(formFile);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);

        }

        [Fact]
        public async Task DetectImage_ShouldReturnEmptyList_WhenNoObjectsAreDetected()
        {
            // Arrange
            var controller = new ObjectDetectionController();

            //Change path on local machine
            var filePath = "/Users/Robin1/Desktop/Scoala/Anul 5/Spring/COMP490/AAC-SARGIK/server.tests/TestImages/empty-image.jpg";
            using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var formFile = new FormFile(stream, 0, stream.Length, null, Path.GetFileName(stream.Name))
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpg"
            };

            // Act
            var result = await controller.DetectImage(formFile);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var classNames = Assert.IsType<List<string>>(okResult.Value);
            Assert.Empty(classNames);
        }
    }
}

