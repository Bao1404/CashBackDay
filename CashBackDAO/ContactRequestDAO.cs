using CashBackObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackDAO
{
    public class ContactRequestDAO
    {
        private readonly CashBackDayContext _context;
        public ContactRequestDAO(CashBackDayContext context)
        {
            _context = context;
        }
        public async Task CreateContactRequest(ContactRequest request)
        {
            _context.ContactRequests.Add(request);
            await _context.SaveChangesAsync();
        }
        public async Task<List<ContactRequest>> GetAllContactRequests()
        {
            return await _context.ContactRequests.ToListAsync();
        }
        public async Task UpdateContactRequest(ContactRequest request)
        {
            _context.ContactRequests.Update(request);
            await _context.SaveChangesAsync();
        }
    }
}
