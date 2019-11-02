using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZawajAPI.Models
{
    public class Like
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("LikeFromUser")]
        public string LikeFromUserId { get; set; }
        public User LikeFromUser { get; set; }
        
        [ForeignKey("LikeToUser")]
        public string LikeToUserId { get; set; }
        public User LikeToUser { get; set; }

        public DateTime LikeOn { get; set; }
        public DateTime? ReadOn { get; set; }
    }
}