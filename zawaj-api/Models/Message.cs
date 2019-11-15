using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZawajAPI.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Sender")]
        public string SenderId { get; set; }
        public User Sender { get; set; }
        
        [ForeignKey("Receiver")]
        public string ReceiverId { get; set; }
        public User Receiver { get; set; }

        public string Content { get; set; }
        public DateTime SentOn { get; set; }
        public DateTime? ReadOn { get; set; }
    }
}