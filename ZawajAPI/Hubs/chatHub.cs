using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using ZawajAPI.DTOs;

namespace ZawajAPI.Hubs
{
    public class chatHub:Hub
    {
        /* public async Task NewMessage(ChatAddDTO msg)  
        {  
            await Clients.All.SendAsync("MessageReceived", msg);  
        }  */
    }
}