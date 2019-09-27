using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace ZawajAPI.Models
{
    public class User:IdentityUser
    {
        public string FullName { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}