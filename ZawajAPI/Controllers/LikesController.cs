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
    public class LikesController : ControllerBase
    {
        private readonly ZawajDbContext _context;
        private readonly IMapper _mapper;

        public LikesController(ZawajDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        // GET: api/Likes
        [HttpGet]
        public async Task<IActionResult> GetLike(string id, bool isLikesFrom)
        {
            if (id != User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString())
            {
                return Unauthorized();
            }
            if (isLikesFrom)
            {
                var likesFromUsers = await _context.Like.Where(l => l.LikeToUserId == id)
                .Select(u => u.LikeFromUser).Include(p=>p.Photos).ToListAsync();
                var users = _mapper.Map<IEnumerable<UserLikeDTO>>(likesFromUsers);
                return Ok(users);
            }
            else
            {
                var likesToUsers = await _context.Like.Where(l => l.LikeFromUserId == id)
                .Select(u => u.LikeToUser).Include(p=>p.Photos).ToListAsync();
                var users = _mapper.Map<IEnumerable<UserLikeDTO>>(likesToUsers);
                return Ok(users);
            }
        }

        // POST: api/Likes
        [HttpPost]
        public async Task<ActionResult<Like>> PostLike(Like like)
        {
            if (like.LikeFromUserId != User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString())
            {
                return Unauthorized();
            }
            if (LikeExists(like.LikeFromUserId, like.LikeToUserId))
            {
                return BadRequest("Liked this before !");
            }
            _context.Like.Add(like);

            if (await _context.SaveChangesAsync() > 0)
            { return Ok(); }
            else { return BadRequest(); }
        }

        // DELETE: api/Likes/5
        [HttpDelete]
        public async Task<ActionResult<Like>> DeleteLike(Like like)
        {
            if (like.LikeFromUserId != User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString())
            {
                return Unauthorized();
            }
            if (!LikeExists(like.LikeFromUserId, like.LikeToUserId))
            {
                return NotFound();
            }

            _context.Like.Remove(like);
            if (await _context.SaveChangesAsync() > 0)
            { return Ok(); }
            else { return BadRequest(); }
        }

        private bool LikeExists(string fromUserId, string toUserId)
        {
            return _context.Like.Any(e => e.LikeFromUserId == fromUserId && e.LikeToUserId == toUserId);
        }

        /*
        // GET: api/Likes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Like>> GetLike(string id)
        {
            var like = await _context.Like.FindAsync(id);

            if (like == null)
            {
                return NotFound();
            }

            return like;
        }
        
        // PUT: api/Likes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLike(string id, Like like)
        {
            if (id != like.LikeFromUserId)
            {
                return BadRequest();
            }

            _context.Entry(like).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LikeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        } */
    }
}
