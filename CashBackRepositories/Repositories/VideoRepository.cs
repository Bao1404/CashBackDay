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
    public class VideoRepository : IVideoReposioty
    {
        private readonly VideoDAO _videoDAO;
        public VideoRepository(VideoDAO videoDAO)
        {
            _videoDAO = videoDAO;
        }
        public Task<List<Video>> GetAllVideos() => _videoDAO.GetAllVideos();
        public Task<Video> GetVideoById(int videoId) => _videoDAO.GetVideoById(videoId);
        public Task AddVideo(Video video) => _videoDAO.AddVideo(video);
        public Task UpdateVideo(Video video) => _videoDAO.UpdateVideo(video);
        public Task DeleteVideo(int videoId) => _videoDAO.DeleteVideo(videoId);
        public Task<List<Video>> GetVideosByCategory(string category) => _videoDAO.GetVideosByCategory(category);
        public Task<List<Video>> SearchVideos(string keyword) => _videoDAO.SearchVideos(keyword);
    }
}
