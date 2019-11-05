using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZawajAPI.Data;
using ZawajAPI.DTOs;
using ZawajAPI.Models;

namespace ZawajAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ZawajDbContext _context;
        private readonly IMapper _mapper;

        public ChatController(ZawajDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        // GET: api/Chat/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var currentUserId = User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString();
            var usersForChat = await _context.Users.Include(p => p.Photos).Where(u => u.Id != currentUserId).OrderByDescending(l => l.LastActive).ToListAsync();
            var users = _mapper.Map<IEnumerable<ChatUsersListDTO>>(usersForChat);
            return Ok(users);
        }


        // GET: api/Chat
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMessages(string id)
        {
            var currentUserId = User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString();
            var messages = _context.Messages
            .Where(m => (m.SenderId == currentUserId && m.ReceiverId == id) || (m.SenderId == id && m.ReceiverId == currentUserId))
            .OrderBy(m=>m.SentOn);
            var x= await messages.Select(m=> new ChatListDTO{
                Content = m.Content,
                SentOn = m.SentOn,
                 isReplay = m.SenderId == currentUserId
            }).ToListAsync();
            messages.Where(m=>m.ReceiverId==currentUserId && m.ReadOn==null).ToList().ForEach(m=>m.ReadOn=DateTime.Now);
            return Ok(x);
        }

        // POST: api/Chat
        [HttpPost]
        public async Task<IActionResult> PostMessage(ChatAddDTO newMessage)
        {
            var message = _mapper.Map<Message>(newMessage);
            _context.Messages.Add(message);
            if (await _context.SaveChangesAsync() > 0)
            { return Ok(); }
            else { return BadRequest(); }
        }

        // GET: api/Chat/count
        [HttpGet("count")]
        public async Task<IActionResult> GetCount()
        {
            var currentUserId = User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString();
            var count = await _context.Messages.Where(m=>m.ReceiverId==currentUserId && m.ReadOn==null).CountAsync();
            return Ok(count);
        }

        /* // GET: api/Chat/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMessage(int id)
        {
            var message = await _context.Messages.FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            return Ok(message);
        }

        // PUT: api/Chat/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessage(int id, Message message)
        {
            if (id != message.Id)
            {
                return BadRequest();
            }

            _context.Entry(message).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessageExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Chat/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return Ok(message);
        }

        private bool MessageExists(int id)
        {
            return _context.Messages.Any(e => e.Id == id);
        } */
    }
}
