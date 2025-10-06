using CashBackDAO;
using CashBackRepositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Repositories
{
    public class RequestRepository : IRequestRepository
    {
        private readonly ContactRequestDAO _contactRequestDAO;
        public RequestRepository(ContactRequestDAO contactRequestDAO)
        {
            _contactRequestDAO = contactRequestDAO;
        }
        public Task CreateContactRequest(CashBackObject.Models.ContactRequest request) => _contactRequestDAO.CreateContactRequest(request);
        public Task<List<CashBackObject.Models.ContactRequest>> GetAllContactRequests() => _contactRequestDAO.GetAllContactRequests();
        public Task UpdateContactRequest(CashBackObject.Models.ContactRequest request) => _contactRequestDAO.UpdateContactRequest(request);
    }
}
