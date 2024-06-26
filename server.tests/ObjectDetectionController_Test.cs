using Microsoft.AspNetCore.Mvc;
using server.Controllers;
using System;

namespace server.tests
{
    public class ObjectDetectionController_Test
    {
        /// <summary>
        /// Tests for the DetectImage() method
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


    }
}

