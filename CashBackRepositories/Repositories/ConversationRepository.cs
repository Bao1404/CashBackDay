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
    public class ConversationRepository : IConversationRepository
    {
        private readonly ConversationDAO _conversationDAO;
        public ConversationRepository(ConversationDAO conversationDAO)
        {
            _conversationDAO = conversationDAO;
        }
        public Task<List<Conversation>> GetAllConversation() => _conversationDAO.GetAllConversation();
        public Task<Conversation> GetConversationById(int id) => _conversationDAO.GetConversationById(id);
        public Task<Conversation> CreateConversation(Conversation conversation) => _conversationDAO.CreateConversation(conversation);
    }
}
