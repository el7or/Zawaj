using System;

namespace ZawajAPI.DTOs
{
    public class UserUpdateDTO
    {
        public string About { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public DateTime UpdatedOn { get{return DateTime.Now;} }       
    }
}