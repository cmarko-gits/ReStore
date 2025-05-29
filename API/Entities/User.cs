using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public string RefreshToken { get; set; }

    } 
}