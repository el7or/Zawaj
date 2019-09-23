using System.ComponentModel.DataAnnotations;

namespace ZawajAPI.DTOs
{
    public class UserRegisterDTO
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(10, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 4)]
        public string Password { get; set; }
    }
}