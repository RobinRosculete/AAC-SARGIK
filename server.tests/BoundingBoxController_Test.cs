using Microsoft.EntityFrameworkCore;
using server.Controllers;
using server.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System;
using System.Threading.Tasks;
using server.DTOs;

namespace server.tests
{
    public class BoundingBoxController_Test
    {
        #region Helper Methods

        // Helper Function To return an InMemory Database context
        private AacSargikDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AacSargikDbContext>()
                .UseInMemoryDatabase(databaseName: "AAC_SARGIK_DB").Options;

            return new AacSargikDbContext(options);
        }

        #endregion

        /// <summary>
        /// Tests for the GetBoundingBoxesForImage() method
        /// </summary>
        [Fact]
        public async Task GetBoundingBoxesForImage_ShouldReturnBoundingBoxes_WhenBoundingBoxesExist()
        {
            // Arrange
            using var context = GetDbContext();
            context.Add(new BoundingBox()
            {
                ImageId = 1,
                XMin = 1,
                YMin = 1,
                XMax = 1,
                YMax = 1,
                Label = "label_test",
                Message = "label_message"
            });
            context.SaveChanges();
            var controller = new BoundingBoxController(context);

            // Act
            var boundingBoxExisting = await controller.GetBoundingBoxesForImage(1) as OkObjectResult;

            // Assert
            Assert.NotNull(boundingBoxExisting);
            Assert.Equal(200, boundingBoxExisting.StatusCode);

            var boundingBoxesExisting = boundingBoxExisting.Value as List<BoundingBox>;
            Assert.NotNull(boundingBoxesExisting);
            Assert.Equal(1, boundingBoxesExisting.First().ImageId);
        }

        [Fact]
        public async Task GetBoundingBoxesForImage_ShouldReturnBoundingBoxes_WhenBoundingBoxesDoNotExist()
        {
            // Arrange
            using var context = GetDbContext();
            var controller = new BoundingBoxController(context);

            // Act
            var boundingBoxNotExisting = await controller.GetBoundingBoxesForImage(2) as OkObjectResult;

            // Assert
            Assert.NotNull(boundingBoxNotExisting);
            Assert.Equal(200, boundingBoxNotExisting.StatusCode);

            var boundingBoxesNotExisting = boundingBoxNotExisting.Value as List<BoundingBox>;
            Assert.NotNull(boundingBoxesNotExisting);
            Assert.Empty(boundingBoxesNotExisting);
        }

        [Fact]
        public async Task GetBoundingBoxesForImage_ShouldReturnBadRequest_WhenImageIdIsInvalid()
        {
            // Arrange
            using var context = GetDbContext();
            var controller = new BoundingBoxController(context);

            // Act
            var result = await controller.GetBoundingBoxesForImage(-1) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Invalid image ID.", result.Value);
        }

        [Fact]
        public async Task GetBoundingBoxesForImage_ShouldReturnInternalServerError_WhenExceptionIsThrown()
        {
            // Arrange
            var mockContext = new Mock<AacSargikDbContext>(new DbContextOptionsBuilder<AacSargikDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            mockContext.Setup(c => c.BoundingBoxes)
                .Throws(new Exception("Database error"));

            var controller = new BoundingBoxController(mockContext.Object);

            // Act
            var result = await controller.GetBoundingBoxesForImage(1) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Internal server error: Database error", result.Value);
        }

        /// <summary>
        /// Tests for the SaveBoundingBox() method
        /// </summary>
        [Fact]
        public async Task SaveBoundingBox_ShouldReturnOk_WhenBoundingBoxIsValid()
        {
            // Arrange
            using var context = GetDbContext();
            context.Images.Add(new Image
            {
                ImageId = 1,
                Caption = "Test caption",
                ImageUri = "https://example.com/image.jpg"
            });
            context.SaveChanges();
            var controller = new BoundingBoxController(context);
            var boundingBoxDTO = new BoundingBoxDTO
            {
                imageID = 1,
                xMin = 1,
                yMin = 1,
                xMax = 2,
                yMax = 2,
                label = "test_label",
                message = "test_message"
            };

            // Act
            var result = await controller.SaveBoundingBox(boundingBoxDTO) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Successfully saved bounding box in the database.", result.Value);
        }

        [Fact]
        public async Task SaveBoundingBox_ShouldReturnBadRequest_WhenBoundingBoxDTOIsInvalid()
        {
            // Arrange
            using var context = GetDbContext();
            var controller = new BoundingBoxController(context);
            var boundingBoxDTO = new BoundingBoxDTO
            {
                imageID = -1,
                xMin = -1,
                yMin = -1,
                xMax = -1,
                yMax = -1,
                label = "",
                message = ""
            };

            // Act
            var result = await controller.SaveBoundingBox(boundingBoxDTO) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Invalid input.", result.Value);
        }

        [Fact]
        public async Task SaveBoundingBox_ShouldReturnNotFound_WhenImageDoesNotExist()
        {
            // Arrange
            using var context = GetDbContext();
            var controller = new BoundingBoxController(context);
            var boundingBoxDTO = new BoundingBoxDTO
            {
                imageID = 99,
                xMin = 1,
                yMin = 1,
                xMax = 2,
                yMax = 2,
                label = "test_label",
                message = "test_message"
            };

            // Act
            var result = await controller.SaveBoundingBox(boundingBoxDTO) as NotFoundObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Image Does not Exist in DB", result.Value);
        }

        [Fact]
        public async Task SaveBoundingBox_ShouldReturnInternalServerError_WhenExceptionIsThrown()
        {
            // Arrange
            var mockContext = new Mock<AacSargikDbContext>(new DbContextOptionsBuilder<AacSargikDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            mockContext.Setup(c => c.Images)
                .Throws(new Exception("Database error"));

            var controller = new BoundingBoxController(mockContext.Object);
            var boundingBoxDTO = new BoundingBoxDTO
            {
                imageID = 1,
                xMin = 1,
                yMin = 1,
                xMax = 2,
                yMax = 2,
                label = "test_label",
                message = "test_message"
            };

            // Act
            var result = await controller.SaveBoundingBox(boundingBoxDTO) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Internal server error: Database error", result.Value);
        }
    }
}
