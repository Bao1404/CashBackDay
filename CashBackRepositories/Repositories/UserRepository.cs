using CashBackDAO;
using CashBackObject.Models;
using CashBackRepositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UserDAO _userDao;

        public UserRepository(UserDAO userDao)
        {
            _userDao = userDao;
        }

        public Task<User> GetUserLogin(string email, string password) => _userDao.GetUserLogin(email, password);
        public Task CreateAccount(User user) => _userDao.CreateAccount(user);
        public Task<User> CheckEmailExist(string email) => _userDao.CheckEmailExist(email);
        public Task<User> CheckPhoneExist(string phone) => _userDao.CheckPhoneExist(phone);
        public Task<User> GetUserById(int userId) => _userDao.GetUserById(userId);
        public Task UpdateAccount(User user) => _userDao.UpdateAccount(user);
    }
}
