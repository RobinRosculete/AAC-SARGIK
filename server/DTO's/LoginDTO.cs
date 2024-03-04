using System;
namespace server.DTOs;
	public class LoginDTO
	{
        public string googleId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailAddress { get; set; }
        public string? PictureUrl { get; set; }
     }


