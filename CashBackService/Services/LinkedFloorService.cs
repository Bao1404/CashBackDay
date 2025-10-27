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
    public class LinkedFloorService : ILinkedFloorService
    {
        private readonly ILinkedFloorRepository _linkedFloorRepository;
        public LinkedFloorService(ILinkedFloorRepository linkedFloorRepository)
        {
            _linkedFloorRepository = linkedFloorRepository;
        }
        public Task AddUserLinkedFloor(UserLinkedFloor linkedFloor) => _linkedFloorRepository.AddUserLinkedFloor(linkedFloor);
        public Task UpdateUserLinkedFloor(UserLinkedFloor linkedFloor) => _linkedFloorRepository.UpdateUserLinkedFloor(linkedFloor);
        public Task<List<UserLinkedFloor>> GetLinkedFloorByUserId(int id) => _linkedFloorRepository.GetLinkedFloorByUserId(id);
    }
}
