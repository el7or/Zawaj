using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ZawajAPI.Data;
using ZawajAPI.DTOs;
using ZawajAPI.Helpers;
using ZawajAPI.Models;

namespace ZawajAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly ZawajDbContext _context;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(ZawajDbContext context, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _context = context;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;
            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret);

            _cloudinary = new Cloudinary(account);
        }

        // GET: api/Photos
        [HttpGet]
        public async Task<IActionResult> GetPhotos()
        {
            return Ok(await _context.Photos.ToListAsync());
        }

        // GET: api/Photos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null)
            {
                return NotFound();
            }

            var photoModel = _mapper.Map<PhotoDetailsDTO>(photo);

            return Ok(photoModel);
        }

        // POST: api/Photos
        [HttpPost("{id}")]
        public async Task<IActionResult> PostPhoto(string id, [FromForm] PhotoAddDTO photoModel)
        {
            if (id != User.FindFirst(JwtRegisteredClaimNames.Jti).Value)
            {
                return Unauthorized();
            }

            var file = photoModel.File;
            var uploadResult = new ImageUploadResult();
            if (file != null && file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoModel.Url = uploadResult.Uri.ToString();
            photoModel.PublicId = uploadResult.PublicId;
            var photo = _mapper.Map<Photo>(photoModel);
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            if (!user.Photos.Any(p => p.IsMain))
            { photo.IsMain = true; }
            else { photo.IsMain = false; }
            user.Photos.Add(photo);
            if (await _context.SaveChangesAsync() > 0)
            {
                var addedPhoto = _mapper.Map<PhotoDetailsDTO>(photo);
                return CreatedAtAction("GetPhoto", new { id = photo.Id }, addedPhoto);
            }
            else
            {
                return BadRequest();
            }
        }

        // PUT: api/Photos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhoto(int id, Photo photo)
        {
            if (id != photo.Id)
            {
                return BadRequest();
            }

            _context.Entry(photo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhotoExists(id))
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

        // DELETE: api/Photos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int id)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null)
            {
                return NotFound();
            }
            if (photo.PublicId != null)
            {
                var deletionParams = new DeletionParams(photo.PublicId);
                var deletionResult = _cloudinary.Destroy(deletionParams);
                if(deletionResult.Result != "ok"){return BadRequest();}
            }

            _context.Photos.Remove(photo);
            if (await _context.SaveChangesAsync() > 0)
            { return Ok(); }
            else { return BadRequest(); }
        }

        // Set Main: api/Photos/SetMain/5
        [HttpGet("setMain/{id}")]
        public async Task<IActionResult> SetMain(int id)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null)
            {
                return NotFound();
            }
            var prevMainPhoto = await _context.Photos.FirstOrDefaultAsync(p => p.UserId == photo.UserId && p.IsMain == true);
            prevMainPhoto.IsMain = false;
            photo.IsMain = true;
            if (await _context.SaveChangesAsync() > 0)
            { return Ok(); }
            else { return BadRequest(); }
        }

        private bool PhotoExists(int id)
        {
            return _context.Photos.Any(e => e.Id == id);
        }
    }
}
