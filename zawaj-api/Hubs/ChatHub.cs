using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ZawajAPI.Data;
using ZawajAPI.DTOs;

namespace ZawajAPI.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ZawajDbContext _context;

        public ChatHub(ZawajDbContext context)
        {
            _context = context;
        }
        /* public async Task NewMessage(ChatAddDTO msg)  
        {  
            await Clients.All.SendAsync("MessageReceived", msg);  
        }  */

        public async Task UpdateUnreadCount(string id)
        {
            await Clients.All.SendAsync("UpdateUnreadCount", new
            {
                id = id,
                count = _context.Messages.Where(m => m.ReceiverId == id && m.ReadOn == null).Count()
            });
        }

        /* public async Task UpdateChatUsers(string id)
        {
            var users = await _context.Users
            .Include(p => p.Photos)
            .Include(u => u.MessagesSent)
            .Where(u => u.Id != id)
            .OrderByDescending(l => l.LastActive)
            .Select(u=> new ChatUsersListDTO{
                Id = u.Id,
                NickName = u.NickName,
                LastActive = u.LastActive,
                PhotoURL = u.Photos.FirstOrDefault(p => p.IsMain).Url,
                UnreadCount = u.MessagesSent.Where(m=> m.ReadOn==null && m.ReceiverId==id).Count()
            }).OrderByDescending(u=>u.UnreadCount)
            .ToListAsync();
            await Clients.All.SendAsync("UpdateChatUsers",users);
        } */
    }
}