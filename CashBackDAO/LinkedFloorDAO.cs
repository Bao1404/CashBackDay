using CashBackObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackDAO
{
    public class LinkedFloorDAO
    {
        private readonly CashBackDayContext _context;
        public LinkedFloorDAO(CashBackDayContext context)
        {
            _context = context;
        }
        public async Task AddUserLinkedFloor(UserLinkedFloor linkedFloor)
        {
            _context.UserLinkedFloors.Add(linkedFloor);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateUserLinkedFloor(UserLinkedFloor linkedFloor)
        {
            _context.UserLinkedFloors.Update(linkedFloor);
            await _context.SaveChangesAsync();
        }
        public async Task<List<UserLinkedFloor>> GetLinkedFloorByUserId(int id)
        {
            return await _context.UserLinkedFloors.Include(u => u.User).Include(u => u.Floor).Where(u => u.UserId == id).ToListAsync();
        }
        public async Task<UserLinkedFloor> GetLinkedFloorByUserIdAndFloorId(int userId, int floorId)
        {
            return await _context.UserLinkedFloors.FirstOrDefaultAsync(u => u.UserId == userId && u.FloorId == floorId);
        }
    }
}
