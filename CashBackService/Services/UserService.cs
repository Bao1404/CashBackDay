using CashBackObject.Models;
using CashBackRepositories.Interfaces;
using CashBackRepositories.Repositories;
using CashBackService.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackService.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }
        public Task<List<User>> GetAllUsers() => _repo.GetAllUsers();
        public Task<User> GetUserLogin(string email, string password) => _repo.GetUserLogin(email, password);
        public Task CreateAccount(User user) => _repo.CreateAccount(user);
        public Task<User> CheckEmailExist(string email) => _repo.CheckEmailExist(email);
        public Task<User> CheckPhoneExist(string phone) => _repo.CheckPhoneExist(phone);
        public Task<User> GetUserById(int userId) => _repo.GetUserById(userId);
        public Task UpdateAccount(User user) => _repo.UpdateAccount(user);
        public Task<List<User>> SearchUser(string input) => _repo.SearchUser(input);
    }
}
