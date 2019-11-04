using System;

namespace ZawajAPI.DTOs
{
    public class ChatAddDTO
    {
        public string SenderId { get; set; }        
        public string ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime SentOn { get; set; } = DateTime.Now;
    }
}