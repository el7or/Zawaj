using System;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using ZawajAPI.Data;
using ZawajAPI.Models;

namespace ZawajAPI.Helpers
{
    public class UserActiveActionFilter : IAsyncActionFilter
    {
        private readonly UserManager<User> _userManager;
        private readonly ZawajDbContext _context;
        public UserActiveActionFilter(UserManager<User> userManager,ZawajDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            string userId = resultContext.HttpContext.User.FindFirst(JwtRegisteredClaimNames.Jti).Value;
            var user = await _userManager.FindByIdAsync(userId);
            user.LastActive = DateTime.Now;
            await _userManager.UpdateAsync(user);
        }
    }
}