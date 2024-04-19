using System;
//DTO used to create object to store Login Information from Client sides Google Login
namespace server.DTOs;
	public class LoginDTO
	{
        public string googleId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailAddress { get; set; }
        public string? PictureUrl { get; set; }
     }


