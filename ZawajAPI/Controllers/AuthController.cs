using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ZawajAPI.DTOs;
using ZawajAPI.Models;

namespace ZawajAPI.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration config, IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDTO userDTO)
        {
            var user = await _userManager.FindByNameAsync(userDTO.UserName);
            if (user == null) return Unauthorized();
            var result = await _signInManager.CheckPasswordSignInAsync(user, userDTO.Password, lockoutOnFailure: false);
            //var result = await _signInManager.PasswordSignInAsync(userDTO.UserName, userDTO.Password, userDTO.RememberMe, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                /* var appUser = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(
                    u => u.NormalizedUserName == userForLoginDto.UserName.ToUpper()
                );
                var userToReturn = _mapper.Map<UserForListDTO>(appUser);
                return Ok(new
                {
                    token = GenerateJwtToken(appUser).Result,
                    user = userToReturn
                }); */

                return Ok(new { token = GenerateJWToken(user).Result, user = user });
            }
            else return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDTO userDTO)
        {
            var user= _mapper.Map<User>(userDTO);
            //var user = new User { UserName = userDTO.UserName, Email = userDTO.UserName, FullName = userDTO.FullName };
            var result = await _userManager.CreateAsync(user, userDTO.Password);
            //var userToReturn = _mapper.Map<UserForDetailsDTO>(userToCreate);
            if (result.Succeeded)
            {
                //return CreatedAtRoute("GetUser", new { controller = "Users", id = userToCreate.Id }, userToReturn);
                //await _signInManager.SignInAsync(user, isPersistent:false);
                return Ok(new { token = GenerateJWToken(user).Result, user = user });
            }
            return BadRequest(result.Errors);
        }

        private async Task<string> GenerateJWToken(User user)
        {
            var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, user.Id),
                    };

             var roles = await _userManager.GetRolesAsync(user);
            /*foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            } */

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Tokens:Issuer"],
            _config["Tokens:Issuer"],
            claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}