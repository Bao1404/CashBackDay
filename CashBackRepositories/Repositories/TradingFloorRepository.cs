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
    public class TradingFloorRepository : ITradingFloorRepository
    {
        private readonly TradingFloorDAO _tradingFloorDAO;
        public TradingFloorRepository(TradingFloorDAO tradingFloorDAO)
        {
            _tradingFloorDAO = tradingFloorDAO;
        }
        public Task<List<TradingFloor>> GetAllTradingFloorsAsync() => _tradingFloorDAO.GetAllTradingFloorsAsync();
    }
}
