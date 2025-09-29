using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsers();
        Task<User> GetUserLogin(string email, string password);
        Task CreateAccount(User user);
        Task<User> CheckEmailExist(string email);
        Task<User> CheckPhoneExist(string phone);
        Task<User> GetUserById(int userId);
        Task UpdateAccount(User user);
        Task<List<User>> SearchUser(string input);
    }
}
