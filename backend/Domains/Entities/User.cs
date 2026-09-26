using Microsoft.AspNetCore.Identity;
using System;

namespace Domains.Entities
{
    public class User : IdentityUser
    {
        public string Name { get; set; }

        public DateTime Dob { get; set; }
        public string? Avatar { get; set; }
        public string? Country { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Active";

        public string Role { get; set; } = "User";
    }
}