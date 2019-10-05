using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZawajAPI.Data;
using ZawajAPI.Domain.IRepository;
using ZawajAPI.DTOs;
using ZawajAPI.Models;

namespace ZawajAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepo _repo;
        private readonly IMapper _mapper;

        public UsersController(IUserRepo repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/Users
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetAllUsers();
            var model = _mapper.Map<IEnumerable<UserListDTO>>(users);
            return Ok(model);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _repo.GetUser(id);
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
            await _repo.AddUser(user);
            return Ok();
            //return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }
            await _repo.UpdateUser(user);
            return Ok();

            /* try
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

            return NoContent();*/
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _repo.DeleteUser(id);
            return Ok();
            /* if (user == null)
            {
                return NotFound();
            } */
        }

        /* private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        } */
    }
}
