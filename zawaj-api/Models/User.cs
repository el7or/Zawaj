using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace ZawajAPI.Models
{
    public class User:IdentityUser
    {
        public string FullName { get; set; }
        public string NickName { get; set; }
        public string Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public string About { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public DateTime LastActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<Like> LikesFrom { get; set; }
        public ICollection<Like> LikesTo { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}