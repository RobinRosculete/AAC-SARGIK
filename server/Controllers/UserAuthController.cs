
//Controller Class to manage User Authenthification (Only using Google Login)

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.DTOs;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace server.Controllers;

    
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

        // API to store new Users in DB and return JWT token 
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] LoginDTO userdata)
        {
            
            if (userdata == null)
            {
                return BadRequest("Invalid user data.");
            }

            try
            {   //Checking if user already exists in the database based on Google ID
                var alreadySavedData = await _db.Users.FirstOrDefaultAsync(u => u.UserGoogleId == userdata.googleId);

                
                if (alreadySavedData != null)
                {
                    //If the user already exists in the database we return requierd user data and generated JWT Token
                    return Ok(new
                    {
                        id = alreadySavedData.Id,
                        message = "User data has already been saved",
                        token = GenerateJwtToken(alreadySavedData),
                        expiration = DateTime.UtcNow.AddYears(1),
                        username = alreadySavedData.FirstName,
                        pictureUrl = alreadySavedData.ProfilePictureUri,
                        userRole = "user",
                    });
                }

                // If new user, we create a new user with requierd data
                var newUser = new User
                {
                    UserGoogleId = userdata.googleId,
                    FirstName = userdata.FirstName,
                    LastName = userdata.LastName,
                    ProfilePictureUri = userdata.PictureUrl,
                    Email = userdata.EmailAddress,
                };

                // Storing new user in database
                await _db.Users.AddAsync(newUser);
                await _db.SaveChangesAsync();

                //Return new user information and JWT token
                return Ok(new
                {
                    id = newUser.Id,
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


 // Function to generate JWT token to be returned for user session.
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.FirstName),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.UniqueName, user.UserGoogleId) // Convert UserId to string
                };

            var claimsIdentity = new ClaimsIdentity(claims, "Token");

      
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claimsIdentity.Claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(
                    _configuration["JwtSettings:ExpirationTimeInMinutes"])),
        
                signingCredentials: GetSigningCredentials()
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    private SigningCredentials GetSigningCredentials()
    {
        var key = Encoding.UTF8.GetBytes(
            _configuration["JwtSettings:SecurityKey"]);
        var secret = new SymmetricSecurityKey(key);
        return new SigningCredentials(secret,
            SecurityAlgorithms.HmacSha256);
    }
}

