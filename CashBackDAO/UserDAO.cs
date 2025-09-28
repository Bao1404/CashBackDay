using CashBackObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackDAO
{
    public class UserDAO
    {
        private readonly CashBackDayContext _context;

        public UserDAO(CashBackDayContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserLogin(string email, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email.Equals(email) && u.PasswordHash.Equals(password));
        }
        public async Task CreateAccount(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        public async Task<User> CheckEmailExist(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));
        }
        public async Task<User> CheckPhoneExist(string phone)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Phone.Equals(phone));
        }
        public async Task<User> GetUserById(int userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }
        public async Task UpdateAccount(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
