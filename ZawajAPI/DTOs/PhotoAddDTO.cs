using System;
using Microsoft.AspNetCore.Http;

namespace ZawajAPI.DTOs
{
    public class PhotoAddDTO
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }  
        public string PublicId { get; set; }
        public DateTime CreatedOn { get{return DateTime.Now;} }  
        public DateTime UpdatedOn { get{return DateTime.Now;} }
    }
}