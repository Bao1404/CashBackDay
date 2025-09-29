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
        public Task EditFloor(TradingFloor floor) => _tradingFloorDAO.EditFloor(floor);
        public Task<TradingFloor> GetTradingFloorById(int id) => _tradingFloorDAO.GetTradingFloorById(id);
        public Task<TradingFloor> GetFloorByName(string name) => _tradingFloorDAO.GetFloorByName(name);
        public Task AddFloor(TradingFloor floor) => _tradingFloorDAO.AddFloor(floor);
        public Task DeleteFloor(int id) => _tradingFloorDAO.DeleteFloor(id);
        public Task<TradingFloor> SearchFloor(string input) => _tradingFloorDAO.SearchFloor(input);
    }
}
