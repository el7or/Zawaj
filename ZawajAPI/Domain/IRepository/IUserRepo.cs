using System.Collections.Generic;
using System.Threading.Tasks;
using ZawajAPI.Models;

namespace ZawajAPI.Domain.IRepository
{
    public interface IUserRepo
    {
        Task<IEnumerable<User>> GetAll();
        Task<User> Find(string id);        
        Task Add(User user);
        Task Update(User user);
        Task Delete(string id);
    }
}