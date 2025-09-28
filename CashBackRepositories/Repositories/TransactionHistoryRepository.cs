using CashBackDAO;
using CashBackObject.Models;
using CashBackRepositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace CashBackRepositories.Repositories
{
    public class TransactionHistoryRepository : ITransactionRepository
    {
        private readonly TransactionHistoryDAO _transactionDao;
        public TransactionHistoryRepository(TransactionHistoryDAO transactionDao)
        {
            _transactionDao = transactionDao;
        }
        public Task CreateTransactionHistory(TransactionHistory transaction) => _transactionDao.CreateTransactionHistory(transaction);
        public Task<List<TransactionHistory>> GetAllTransactionByUserId(int id) => _transactionDao.GetAllTransactionByUserId(id);
        public Task<TransactionHistory> GetTransactionByUserId(int id) => _transactionDao.GetTransactionByUserId(id);
    }
}
