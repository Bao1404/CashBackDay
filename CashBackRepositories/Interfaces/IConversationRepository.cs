using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Interfaces
{
    public interface IConversationRepository
    {
        Task<List<Conversation>> GetAllConversation();
        Task<Conversation> GetConversationById(int id);
        Task<Conversation> CreateConversation(Conversation conversation);
        Task<Conversation> UpdateConversation(Conversation conversation);
    }
}
