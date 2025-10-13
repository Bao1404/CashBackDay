using CashBackDAO;
using CashBackRepositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly MessageDAO _messageDAO;
        public MessageRepository(MessageDAO messageDAO)
        {
            _messageDAO = messageDAO;
        }
        public Task<List<CashBackObject.Models.Message>> GetMessageByConversationId(int id) => _messageDAO.GetMessageByConversationId(id);
        public Task<CashBackObject.Models.Message> CreateMessage(CashBackObject.Models.Message message) => _messageDAO.CreateMessage(message);
        public Task<CashBackObject.Models.Message> UpdateMessage(CashBackObject.Models.Message message) => _messageDAO.UpdateMessage(message);
        public Task MarkMessagesAsRead(int conversationId, int userId) => _messageDAO.MarkMessagesAsRead(conversationId, userId);
    }
}
