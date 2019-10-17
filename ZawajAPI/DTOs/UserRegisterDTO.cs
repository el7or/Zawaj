using System;
using System.ComponentModel.DataAnnotations;

namespace ZawajAPI.DTOs
{
    public class UserRegisterDTO
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string NickName { get; set; }

        [Required]
        public DateTime BirthDate { get; set; }

        [Required]
        public int Gender { get; set; }

        public string Country { get; set; }
        public string City { get; set; }
        public DateTime CreatedOn { get { return DateTime.Now; } }
        public DateTime UpdatedOn { get { return DateTime.Now; } }
    }
}