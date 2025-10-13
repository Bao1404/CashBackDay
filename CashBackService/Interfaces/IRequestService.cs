using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackService.Interfaces
{
    public interface IRequestService
    {
        Task CreateContactRequest(ContactRequest request);
        Task<List<ContactRequest>> GetAllContactRequests();
        Task UpdateContactRequest(ContactRequest request);
    }
}
