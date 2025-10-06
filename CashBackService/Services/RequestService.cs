using CashBackObject.Models;
using CashBackRepositories.Interfaces;
using CashBackService.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackService.Services
{
    public class RequestService : IRequestService
    {
        private readonly IRequestRepository _requestRepository;
        public RequestService(IRequestRepository requestRepository)
        {
            _requestRepository = requestRepository;
        }
        public Task CreateContactRequest(ContactRequest request) => _requestRepository.CreateContactRequest(request);
        public Task<List<ContactRequest>> GetAllContactRequests() => _requestRepository.GetAllContactRequests();
        public Task UpdateContactRequest(ContactRequest request) => _requestRepository.UpdateContactRequest(request);
    }
}
