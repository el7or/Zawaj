using System;

namespace ZawajAPI.DTOs
{
    public class ChatUsersListDTO
    {
        public string Id { get; set; }
        public string NickName { get; set; }
        public string PhotoURL { get; set; }
        public DateTime LastActive { get; set; }
    }
}