using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZawajAPI.Data;
using ZawajAPI.Domain.IRepository;
using ZawajAPI.Models;

namespace ZawajAPI.Domain.Repository
{
    public class UserRepo : IUserRepo
    {
        public ZawajDbContext _context { get; }
        public UserRepo(ZawajDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users.Include(u=>u.Photos).OrderByDescending(u=>u.LastActive).ToListAsync();
        }

        public async Task<User> GetUser(string id)
        {
            return await _context.Users.Include(u=>u.Photos).FirstOrDefaultAsync(u=>u.Id==id);
        }

        public async Task AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUser(User user)
        {
            //_context.Entry(user).State = EntityState.Modified;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUser(string id)
        {
            var user = _context.Users.Find(id);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}