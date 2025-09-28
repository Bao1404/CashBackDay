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
    }
}
