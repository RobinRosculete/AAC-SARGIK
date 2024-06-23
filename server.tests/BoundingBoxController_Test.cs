using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using server.Controllers;
using server.Models;
using Xunit;
using Microsoft.AspNetCore.Mvc;

namespace server.tests
{
	public class BoundingBoxController_Test
	{
        /// <summary>
        /// Test the GetBoundingBoxesForImage() method
        /// </summary>
        [Fact]
        public async Task GetBoundingBoxesForImage()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<AacSargikDbContext>()
    .UseInMemoryDatabase(databaseName: "AAC_SARGIK_DB").Options;
            using var context = new AacSargikDbContext(options);
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
            var bounding_box_notExisting = await controller.GetBoundingBoxesForImage(2) as OkObjectResult;
          
            //Assert
            Assert.NotNull(bounding_box_existing);
            Assert.Equal(200, bounding_box_existing.StatusCode);

            var boundingBoxesExisting = bounding_box_existing.Value as List<BoundingBox>;
            Assert.NotNull(boundingBoxesExisting);
            Assert.Single(boundingBoxesExisting);
            Assert.Equal(1, boundingBoxesExisting.First().ImageId);

            Assert.NotNull(bounding_box_notExisting);
            Assert.Equal(200, bounding_box_notExisting.StatusCode);

            var boundingBoxesNotExisting = bounding_box_notExisting.Value as List<BoundingBox>;
            Assert.NotNull(boundingBoxesNotExisting);
            Assert.Empty(boundingBoxesNotExisting);
        }// end GetBoundingBoxesForImage()

    }
}

