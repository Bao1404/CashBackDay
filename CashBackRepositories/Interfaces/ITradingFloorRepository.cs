using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Interfaces
{
    public interface ITradingFloorRepository
    {
        Task<List<TradingFloor>> GetAllTradingFloorsAsync();
        Task EditFloor(TradingFloor floor);
        Task<TradingFloor> GetTradingFloorById(int id);
        Task<TradingFloor> GetFloorByName(string name);
        Task AddFloor(TradingFloor floor);
        Task DeleteFloor(int id);
        Task<TradingFloor> SearchFloor(string input);
    }
}
