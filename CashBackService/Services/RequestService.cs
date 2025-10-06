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
        private readonly CashBackRepositories.Interfaces.IRequestRepository _requestRepository;
        public RequestService(CashBackRepositories.Interfaces.IRequestRepository requestRepository)
        {
            _requestRepository = requestRepository;
        }
        public Task CreateContactRequest(CashBackObject.Models.ContactRequest request) => _requestRepository.CreateContactRequest(request);
        public Task<List<CashBackObject.Models.ContactRequest>> GetAllContactRequests() => _requestRepository.GetAllContactRequests();
        public Task UpdateContactRequest(CashBackObject.Models.ContactRequest request) => _requestRepository.UpdateContactRequest(request);
    }
}
