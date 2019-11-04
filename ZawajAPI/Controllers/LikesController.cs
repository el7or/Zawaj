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
using ZawajAPI.Helpers;
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
        public async Task<IActionResult> GetLike([FromQuery] LikesParams likesParams)
        {
            if (likesParams.Id != User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString())
            {
                return Unauthorized();
            }
            if (likesParams.IsLikesFrom)
            {
                var likesFromUsers = await _context.Likes.Where(l => l.LikeToUserId == likesParams.Id)
                .Select(u => u.LikeFromUser).Include(p=>p.Photos).ToListAsync();
                var users = _mapper.Map<IEnumerable<LikeListDTO>>(likesFromUsers);
                return Ok(users);
            }
            else
            {
                var likesToUsers = await _context.Likes.Where(l => l.LikeFromUserId == likesParams.Id)
                .Select(u => u.LikeToUser).Include(p=>p.Photos).ToListAsync();
                var users = _mapper.Map<IEnumerable<LikeListDTO>>(likesToUsers);
                return Ok(users);
            }
        }

        // POST: api/Likes
        [HttpPost]
        public async Task<IActionResult> PostLike(LikeAddDTO likeDto)
        {
            if (likeDto.LikeFromUserId != User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString())
            {
                return Unauthorized();
            }
            if (LikeExists(likeDto.LikeFromUserId, likeDto.LikeToUserId))
            {
                return BadRequest("Liked this before !");
            }
            var like = _mapper.Map<Like>(likeDto);
            _context.Likes.Add(like);

            if (await _context.SaveChangesAsync() > 0)
            { return Ok(); }
            else { return BadRequest(); }
        }

        // DELETE: api/Likes/5
        [HttpDelete]
        public async Task<IActionResult> DeleteLike(LikeDeleteDTO likeDto)
        {
            if (likeDto.LikeFromUserId != User.FindFirst(JwtRegisteredClaimNames.Jti).Value.ToString())
            {
                return Unauthorized();
            }
            if (!LikeExists(likeDto.LikeFromUserId, likeDto.LikeToUserId))
            {
                return NotFound();
            }
            var like = _context.Likes.FirstOrDefault(e => e.LikeFromUserId == likeDto.LikeFromUserId && e.LikeToUserId == likeDto.LikeToUserId);
            _context.Likes.Remove(like);
            if (await _context.SaveChangesAsync() > 0)
            { return Ok(); }
            else { return BadRequest(); }
        }

        private bool LikeExists(string fromUserId, string toUserId)
        {
            return _context.Likes.Any(e => e.LikeFromUserId == fromUserId && e.LikeToUserId == toUserId);
        }

        /*
        // GET: api/Likes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLike(string id)
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
