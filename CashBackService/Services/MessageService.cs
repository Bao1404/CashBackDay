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
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        public MessageService(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }
        public Task<List<Message>> GetMessageByConversationId(int id) => _messageRepository.GetMessageByConversationId(id);
        public Task<Message> CreateMessage(CashBackObject.Models.Message message) => _messageRepository.CreateMessage(message);
        public Task<Message> UpdateMessage(CashBackObject.Models.Message message) => _messageRepository.UpdateMessage(message);
        public Task MarkMessagesAsRead(int conversationId, int userId) 
            => _messageRepository.MarkMessagesAsRead(conversationId, userId);
    }
}
