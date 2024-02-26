using System;
namespace server.DTOs;
	public class LoginDTO
	{
        public required string UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailAddress { get; set; }
        public string? PictureUrl { get; set; }
        public string? Provider { get; set; }
}


