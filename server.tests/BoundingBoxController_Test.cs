using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using server.Controllers;
using server.Models;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using System;

namespace server.tests;

	public class BoundingBoxController_Test
	{

        //Helper Function To return a InMemory Database context
        AacSargikDbContext getDbContext()
        {
            var options = new DbContextOptionsBuilder<AacSargikDbContext>()
.UseInMemoryDatabase(databaseName: "AAC_SARGIK_DB").Options;
            
            return new AacSargikDbContext(options);;
        }


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


        }// end GetBoundingBoxesForImage()

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

    /// <summary>
    /// Tests for the SaveBoundingBox([FromBody] BoundingBoxDTO boundingBoxDTO) method
    /// </summary>

}// EndClass


