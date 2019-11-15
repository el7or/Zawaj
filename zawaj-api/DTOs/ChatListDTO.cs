using System;

namespace ZawajAPI.DTOs
{
    public class ChatListDTO
    {
        public string Content { get; set; }
        public DateTime SentOn { get; set; }
        public bool isReplay { get; set; }
    }
}