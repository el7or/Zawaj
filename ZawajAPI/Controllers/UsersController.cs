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
    public class UsersController : ControllerBase
    {
        public ZawajDbContext _context { get; }
        private readonly IMapper _mapper;

        public UsersController(ZawajDbContext context, IMapper mapper)
        {
            _mapper = mapper;
             _context = context;
        }

        // GET: api/Users
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.Include(u=>u.Photos).OrderByDescending(u=>u.LastActive).ToListAsync();
            var model = _mapper.Map<IEnumerable<UserListDTO>>(users);
            return Ok(model);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _context.Users.Include(u=>u.Photos).FirstOrDefaultAsync(u=>u.Id==id);
            var model = _mapper.Map<UserDetailsDTO>(user);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok();
            //return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, UserUpdateDTO model)
        {
            if (id != User.FindFirst(JwtRegisteredClaimNames.Jti).Value)
            {
                return Unauthorized();
            }
            var user = await _context.Users.FindAsync(id);
            _mapper.Map(model, user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();            
        }

        private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
