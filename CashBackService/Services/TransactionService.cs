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
    public class TransactionService : ITransactionHistoryService
    {
        private readonly ITransactionRepository _transactionRepository;
        public TransactionService(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }
        public Task CreateTransactionHistory(TransactionHistory transaction) => _transactionRepository.CreateTransactionHistory(transaction);
        public Task<List<TransactionHistory>> GetAllTransactionByUserId(int id) => _transactionRepository.GetAllTransactionByUserId(id);
        public Task<TransactionHistory> GetTransactionByUserId(int id) => _transactionRepository.GetTransactionByUserId(id);
    }
}
