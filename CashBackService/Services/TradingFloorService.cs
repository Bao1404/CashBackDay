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
        public Task EditFloor(TradingFloor floor) => _tradingFloorRepository.EditFloor(floor);
        public Task<TradingFloor> GetTradingFloorById(int id) => _tradingFloorRepository.GetTradingFloorById(id);
        public Task<TradingFloor> GetFloorByName(string name) => _tradingFloorRepository.GetFloorByName(name);
        public Task AddFloor(TradingFloor floor) => _tradingFloorRepository.AddFloor(floor);
        public Task DeleteFloor(int id) => _tradingFloorRepository.DeleteFloor(id);
        public Task<TradingFloor> SearchFloor(string input) => _tradingFloorRepository.SearchFloor(input);
    }
}
