using CashBackDAO;
using CashBackObject.Models;
using CashBackRepositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Repositories
{
    public class LinkedFloorRepository : ILinkedFloorRepository
    {
        private readonly LinkedFloorDAO _dao;
        public LinkedFloorRepository(LinkedFloorDAO dao)
        {
            _dao = dao;
        }
        public Task AddUserLinkedFloor(UserLinkedFloor linkedFloor) => _dao.AddUserLinkedFloor(linkedFloor);
        public Task UpdateUserLinkedFloor(UserLinkedFloor linkedFloor) => _dao.UpdateUserLinkedFloor(linkedFloor);
        public Task<List<UserLinkedFloor>> GetLinkedFloorByUserId(int id) => _dao.GetLinkedFloorByUserId(id);
    }
}
