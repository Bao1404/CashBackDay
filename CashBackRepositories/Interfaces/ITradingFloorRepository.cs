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
    }
}
