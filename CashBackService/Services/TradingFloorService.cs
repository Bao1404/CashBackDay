using CashBackObject.Models;
using CashBackRepositories.Interfaces;
using CashBackService.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackService.Services
{
    public class TradingFloorService : ITradingFloorService
    {
        private readonly ITradingFloorRepository _tradingFloorRepository;
        public TradingFloorService(ITradingFloorRepository tradingFloorRepository)
        {
            _tradingFloorRepository = tradingFloorRepository;
        }
        public Task<List<TradingFloor>> GetAllTradingFloorsAsync() => _tradingFloorRepository.GetAllTradingFloorsAsync();
    }
}
