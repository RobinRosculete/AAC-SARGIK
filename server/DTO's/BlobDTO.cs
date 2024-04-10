using System;
namespace server.DTOs;

public class BlobDTO
{
    public string? Uri { get; set; }
    public string? Name { get; set; }
    public string? ContentType { get; set; }
    public Stream? Content{ get; set; }

}


