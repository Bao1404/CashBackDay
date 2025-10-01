using CashBackObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackDAO
{
    public class TradingFloorDAO
    {
        private readonly CashBackDayContext _context;
        public TradingFloorDAO(CashBackDayContext context)
        {
            _context = context;
        }
        public async Task<List<TradingFloor>> GetAllTradingFloorsAsync()
        {
            return await _context.TradingFloors.ToListAsync();
        }
        public async Task EditFloor(TradingFloor floor)
        {
            _context.TradingFloors.Update(floor);
            await _context.SaveChangesAsync();
        }
        public async Task<TradingFloor> GetTradingFloorById(int id)
        {
            return await _context.TradingFloors.FirstOrDefaultAsync(f => f.FloorId == id);
        }
        public async Task<TradingFloor> GetFloorByName(string name)
        {
            return await _context.TradingFloors.FirstOrDefaultAsync(f => f.FloorName.ToLower().Equals(name.ToLower()));
        }
        public async Task AddFloor(TradingFloor floor)
        {
            _context.TradingFloors.Add(floor);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteFloor(int id)
        {
            var floor = await _context.TradingFloors.FirstOrDefaultAsync(f => f.FloorId == id);
            if (floor != null)
            {
                _context.TradingFloors.Remove(floor);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<TradingFloor> SearchFloor(string input)
        {
            return await _context.TradingFloors.FirstOrDefaultAsync(f => f.FloorName.Equals(input));
        }
    }
}
