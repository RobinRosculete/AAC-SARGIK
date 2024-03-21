
//Controler used to manage upload, delete and update of images to Azure Blob Stroage 

using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    public class BlobController : Controller
    {
        private readonly BlobFileService _blobFileService;
        public BlobController(BlobFileService blobFileService)
        {
            _blobFileService = blobFileService;

        }

        //Api to list all files in the Blob Storage
        // GET: api/values
        [HttpGet]
        public async Task <IActionResult> ListAllBlolbs()
        {
            var result = await _blobFileService.ListAsync();
            return Ok(result);
        }


        //API to upload Images to Blob Storage
        // POST api/values
        [HttpPost]
        public async Task <IActionResult> UploadImage(IFormFile file)
        {
            var result = await _blobFileService.UploadAsync(file);
            return Ok(result);

        }

        //Api to Download Images From Blob Storage
        // GET api/values/5
        [HttpGet]
        [Route("fileName")]
        public async Task <IActionResult> DownloadImage(string fileName)
        {
            var result = await _blobFileService.DownloadAsync(fileName);
            return File(result.Content,result.ContentType,result.Name);
        }

  
        // Api to Delete Images/filse given a file name
        // DELETE api/values/5
        [HttpDelete]
        [Route("fileName")]
        public async Task<IActionResult> DeleteImage(string fileName)
        {
            var result = await _blobFileService.DeleteAsync(fileName);
            return Ok(result);
        }
    }
}

