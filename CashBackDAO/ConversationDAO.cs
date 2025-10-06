using CashBackObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackDAO
{
    public class ConversationDAO
    {
        private readonly CashBackDayContext _context;
        public ConversationDAO(CashBackDayContext context)
        {
            _context = context;
        }
        public async Task<List<Conversation>> GetAllConversation()
        {
            return await _context.Conversations.ToListAsync();
        }
        public async Task<Conversation> GetConversationById(int id)
        {
            return await _context.Conversations.FirstOrDefaultAsync(c => c.ConversationId == id);
        }
        public async Task<Conversation> CreateConversation(Conversation conversation)
        {
            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();
            return conversation;
        }
    }
}
