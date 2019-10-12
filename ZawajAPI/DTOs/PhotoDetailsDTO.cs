using System;

namespace ZawajAPI.DTOs
{
    public class PhotoDetailsDTO
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public bool IsMain { get; set; }
        public bool IsApproved { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string PublicId { get; set; }
    }
}