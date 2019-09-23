using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDTO userDTO)
        {
            //var user = await _userManager.FindByNameAsync(userDTO.UserName);
            //if (user == null) return Unauthorized();
            //var result = await _signInManager.CheckPasswordSignInAsync(user, userDTO.Password, false);
            var result = await _signInManager.PasswordSignInAsync(userDTO.UserName, userDTO.Password, userDTO.RememberMe, lockoutOnFailure: false);
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
                return Ok();
            }
            else return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDTO userDTO)
        {
            //var userToCreate = _mapper.Map<User>(userForRegisterDto);
            var user = new User { UserName = userDTO.UserName, Email = userDTO.UserName };
            var result = await _userManager.CreateAsync(user,userDTO.Password);
            //var userToReturn = _mapper.Map<UserForDetailsDTO>(userToCreate);
            if(result.Succeeded){
                //return CreatedAtRoute("GetUser", new { controller = "Users", id = userToCreate.Id }, userToReturn);
                //await _signInManager.SignInAsync(user, isPersistent:false);
                return Ok(StatusCode(201));
            }
            return BadRequest(result.Errors);            
        }
    }
}