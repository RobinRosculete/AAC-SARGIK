using Microsoft.EntityFrameworkCore;
using server.Controllers;
using server.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace server.tests;

	public class BoundingBoxController_Test
	{
    #region Helper Methods
    //Helper Function To return a InMemory Database context
    AacSargikDbContext getDbContext()
        {
            var options = new DbContextOptionsBuilder<AacSargikDbContext>()
.UseInMemoryDatabase(databaseName: "AAC_SARGIK_DB").Options;
            
            return new AacSargikDbContext(options);;
        }
    #endregion


    /// <summary>
    /// Tests for the GetBoundingBoxesForImage() method
    /// </summary>
    [Fact]
        public async Task GetBoundingBoxesForImage_ShouldReturnBoundingBoxes_WhenBoundingBoxesExist()
        {
            // Arrange
            using var context = getDbContext();
            context.Add(new BoundingBox()
            {
                ImageId = 1,
                XMin = 1,
                YMin =1,
                XMax = 1,
                YMax = 1,
                Label = "label_test",
                Message = "label_message"
            });
            context.SaveChanges();
            var controller = new BoundingBoxController(context);
         

            // Act
            var bounding_box_existing = await controller.GetBoundingBoxesForImage(1) as OkObjectResult;
           
          
            //Assert
            Assert.NotNull(bounding_box_existing);
            Assert.Equal(200, bounding_box_existing.StatusCode);

            var boundingBoxesExisting = bounding_box_existing.Value as List<BoundingBox>;

            Assert.NotNull(boundingBoxesExisting);
            Assert.Single(boundingBoxesExisting);
            Assert.Equal(1, boundingBoxesExisting.First().ImageId);


    }// end GetBoundingBoxesForImage_ShouldReturnBoundingBoxes_WhenBoundingBoxesExist()

    [Fact]
        public async Task GetBoundingBoxesForImage_ShouldReturnBoundingBoxes_WhenBoundingBoxesDoNotExist()
        {
            //Arange
            using var context = getDbContext();
            var controller = new BoundingBoxController(context);
            //Act
            var bounding_box_notExisting = await controller.GetBoundingBoxesForImage(2) as OkObjectResult;
            //Assert
            Assert.NotNull(bounding_box_notExisting);
            Assert.Equal(200, bounding_box_notExisting.StatusCode); //Checking return of correct StatusCode

            var boundingBoxesNotExisting = bounding_box_notExisting.Value as List<BoundingBox>;
            Assert.NotNull(boundingBoxesNotExisting);
            Assert.Empty(boundingBoxesNotExisting);

        }

    [Fact]
    public async Task GetBoundingBoxesForImage_ShouldReturnBadRequest_WhenImageIdIsInvalid()
    {
        // Arrange
        using var context = getDbContext();
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

}// EndClass


