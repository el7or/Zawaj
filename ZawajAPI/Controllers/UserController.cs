using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZawajAPI.Data;
using ZawajAPI.Domain.IRepository;
using ZawajAPI.Models;

namespace ZawajAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepo _repo;

        public UserController(IUserRepo repo)
        {
            _repo = repo;
        }

        // GET: api/User
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetAll();
            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _repo.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }
            await _repo.Update(user);
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

        // POST: api/User
        [HttpPost]
        public async Task<IActionResult> PostUser(User user)
        {
             await _repo.Add(user);
             return Ok();
            //return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _repo.Delete(id);
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
