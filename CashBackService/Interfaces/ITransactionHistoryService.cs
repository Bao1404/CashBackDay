using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackService.Interfaces
{
    public interface ITransactionHistoryService
    {
        Task CreateTransactionHistory(TransactionHistory transaction);
        Task<List<TransactionHistory>> GetAllTransactionByUserId(int id);
        Task<TransactionHistory> GetTransactionByUserId(int id);
    }
}
