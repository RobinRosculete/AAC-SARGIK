using server.Models;

namespace server.Services;
public class DbService
{
    private readonly AacSargikDbContext _db;

    public DbService(AacSargikDbContext db)
    {
        _db = db;
       
    }

    //Function to delete Images and Bounding Boxes from Database given Image id
    public string DeleteImageAndBoundingBoxes(int imageId)
    {
        try
        {
            var imageToDelete = _db.Images.FirstOrDefault(i => i.ImageId == imageId);
            if (imageToDelete == null)
            {
                return $"Image with ID {imageId} not found.";
            }

            var boundingBoxesToDelete = _db.BoundingBoxes.Where(b => b.ImageId == imageId);

            _db.BoundingBoxes.RemoveRange(boundingBoxesToDelete);
            _db.Images.Remove(imageToDelete);
            _db.SaveChanges();

            return null; // No error, return null
        }
        catch (Exception ex)
        {
            // Log the exception or handle it as needed
            return $"Failed to delete image with ID {imageId}: {ex.Message}";
        }
    }

    //Function to return the Image Uri from the DB based on Id
    public string GetImageUriById(int imageId)
    {
        try
        {
            string imagUri = _db.Images
                .Where(i => i.ImageId == imageId)
                .Select(i => i.ImageUri)
                .FirstOrDefault();
            if (imagUri == null)
            {
                return $"Image Uri with ID {imageId} not found.";
            }

            return imagUri;
        }
        catch (Exception ex)
        {
            // Log the exception or handle it as needed
            return $"Failed to retrieve image URI for ID {imageId}: {ex.Message}";
        }
    }
}
