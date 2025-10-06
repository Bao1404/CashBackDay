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
    public class ConversationService : IConversationService
    {
        private readonly IConversationRepository _conversationRepository;
        public ConversationService(IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }
        public Task<List<Conversation>> GetAllConversation() => _conversationRepository.GetAllConversation();
        public Task<Conversation> GetConversationById(int id) => _conversationRepository.GetConversationById(id);
        public Task<Conversation> CreateConversation(Conversation conversation) => _conversationRepository.CreateConversation(conversation);
    }
}
