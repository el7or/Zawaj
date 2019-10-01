using System.Collections.Generic;
using System.Threading.Tasks;
using ZawajAPI.Models;

namespace ZawajAPI.Domain.IRepository
{
    public interface IUserRepo
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUser(string id);        
        Task AddUser(User user);
        Task UpdateUser(User user);
        Task DeleteUser(string id);
    }
}