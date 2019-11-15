using System;

namespace ZawajAPI.DTOs
{
    public class LikeAddDTO
    {
        public int Id { get; set; }
        public string LikeFromUserId { get; set; }        
        public string LikeToUserId { get; set; }
        public DateTime LikeOn { get; set; } = DateTime.Now;
    }
}