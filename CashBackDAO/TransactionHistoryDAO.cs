using CashBackObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackDAO
{
    public class TransactionHistoryDAO
    {
        private readonly CashBackDayContext _context;
        public TransactionHistoryDAO(CashBackDayContext context)
        {
            _context = context;
        }
        public async Task CreateTransactionHistory(TransactionHistory transaction)
        {
            _context.TransactionHistories.Add(transaction);
            await _context.SaveChangesAsync();
        }
        public async Task<TransactionHistory> GetTransactionByUserId(int id)
        {
            return await _context.TransactionHistories.FirstOrDefaultAsync(t => t.UserId == id);
        }
        public async Task<List<TransactionHistory>> GetAllTransactionByUserId(int id)
        {
            return await _context.TransactionHistories.Where(t => t.UserId == id).ToListAsync();
        }
    }
}
