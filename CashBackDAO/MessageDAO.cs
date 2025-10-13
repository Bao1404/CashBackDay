using CashBackObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackDAO
{
    public class MessageDAO
    {
        private readonly CashBackDayContext _context;
        public MessageDAO(CashBackDayContext context)
        {
            _context = context;
        }
        public async Task<List<Message>> GetMessageByConversationId(int id)
        {
            return await _context.Messages.Include(m => m.Sender).Where(m => m.ConversationId == id).ToListAsync();
        }
        public async Task<Message> CreateMessage(Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }
        public async Task<Message> UpdateMessage(Message message)
        {
            _context.Messages.Update(message);
            await _context.SaveChangesAsync();
            return message;
        }
        public async Task MarkMessagesAsRead(int conversationId, int userId)
        {
            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId 
                    && m.ReceiverId == userId 
                    && m.IsRead == false)
                .ToListAsync();
            
            foreach (var message in messages)
            {
                message.IsRead = true;
            }
            
            await _context.SaveChangesAsync();
        }
    }
}
