using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackService.Interfaces
{
    public interface IMessageService
    {
        Task<List<Message>> GetMessageByConversationId(int id);
        Task<Message> CreateMessage(Message message);
    }
}
