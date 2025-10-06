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
    }
}
