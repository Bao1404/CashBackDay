using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Interfaces
{
    public interface IRequestRepository
    {
        Task CreateContactRequest(ContactRequest request);
        Task<List<ContactRequest>> GetAllContactRequests();
        Task UpdateContactRequest(ContactRequest request);
    }
}
