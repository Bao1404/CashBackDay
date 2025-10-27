using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackRepositories.Interfaces
{
    public interface ILinkedFloorRepository
    {
        Task AddUserLinkedFloor(UserLinkedFloor linkedFloor);
        Task UpdateUserLinkedFloor(UserLinkedFloor linkedFloor);
        Task<List<UserLinkedFloor>> GetLinkedFloorByUserId(int id);
        Task<UserLinkedFloor> GetLinkedFloorByUserIdAndFloorId(int userId, int floorId);
    }
}
