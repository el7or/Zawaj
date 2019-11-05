using System;
using System.Collections.Generic;
using ZawajAPI.Models;

namespace ZawajAPI.DTOs
{
    public class UserDetailsDTO
    {
        public string Id { get; set; }
        public string UserName { get; set; }   
        public string FullName { get; set; }       
        public string Gender { get; set; }
        public int Age { get; set; }
        public string NickName { get; set; }
        public DateTime LastActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string About { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string PhotoURL { get; set; }
        public ICollection<PhotoDetailsDTO> Photos { get; set; }
        public bool? isLiking { get; set; }
    }
}