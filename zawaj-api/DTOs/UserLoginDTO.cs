using System.ComponentModel.DataAnnotations;

namespace ZawajAPI.DTOs
{
    public class UserLoginDTO
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}