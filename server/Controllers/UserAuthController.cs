using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.DTOs;
using server.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AacSargikDbContext _db;
        private readonly IConfiguration _configuration;

        public UserController(AacSargikDbContext db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] LoginDTO userdata)
        {
            if (userdata == null)
            {
                return BadRequest("Invalid user data.");
            }

            try
            {
                var alreadySavedData = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userdata.UserId);

                if (alreadySavedData != null)
                {
                    return Ok(new
                    {
                        id = alreadySavedData.UserId,
                        message = "User data has already been saved",
                        token = GenerateJwtToken(alreadySavedData),
                        expiration = DateTime.UtcNow.AddYears(1),
                        username = alreadySavedData.FirstName,
                        pictureUrl = alreadySavedData.ProfilePictureUri,
                        userRole = "user",
                    });
                }

                var newUser = new User
                {
                    UserId = userdata.UserId,
                    FirstName = userdata.FirstName,
                    LastName = userdata.LastName,
                    ProfilePictureUri = userdata.PictureUrl,
                    Email = userdata.EmailAddress,
                };

                await _db.Users.AddAsync(newUser);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = newUser.UserId,
                    message = "User login successful",
                    username = newUser.FirstName,
                    pictureUrl = newUser.ProfilePictureUri,
                    userRole = "user",
                    token = GenerateJwtToken(newUser),
                    expiration = DateTime.UtcNow.AddYears(1)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        private string GenerateJwtToken(User user)
        {
            var encryptionKey = _configuration["AppSettings:EncryptionKey"];
            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.FirstName),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.UniqueName, user.UserId.ToString()) // Convert UserId to string
    };

            var claimsIdentity = new ClaimsIdentity(claims, "Token");

            var loginKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(encryptionKey));
            var token = new JwtSecurityToken(
                issuer: "ifeoluwa",
                audience: "ifeoluwa",
                expires: DateTime.UtcNow.AddYears(1),
                claims: claimsIdentity.Claims,
                signingCredentials: new SigningCredentials(loginKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
