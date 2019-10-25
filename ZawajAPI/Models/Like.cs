using System.ComponentModel.DataAnnotations.Schema;

namespace ZawajAPI.Models
{
    public class Like
    {        
        [ForeignKey("LikeFromUser")]
        public string LikeFromUserId { get; set; }
        public User LikeFromUser { get; set; }
        
        [ForeignKey("LikeToUser")]
        public string LikeToUserId { get; set; }
        public User LikeToUser { get; set; }
    }
}