using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackService.Interfaces
{
    public interface IConversationService
    {
        Task<List<Conversation>> GetAllConversation();
        Task<Conversation> GetConversationById(int id);
        Task<Conversation> CreateConversation(Conversation conversation);
    }
}
