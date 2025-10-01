using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackService.Interfaces
{
    public interface IVideoService
    {
        Task<List<Video>> GetAllVideos();
        Task<Video> GetVideoById(int videoId);
        Task AddVideo(Video video);
        Task UpdateVideo(Video video);
        Task DeleteVideo(int videoId);
        Task<List<Video>> GetVideosByCategory(string category);
        Task<List<Video>> SearchVideos(string keyword);
    }
}
