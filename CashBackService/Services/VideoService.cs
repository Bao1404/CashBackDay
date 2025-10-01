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
    public class VideoService : IVideoService
    {
        private readonly IVideoReposioty _videoReposioty;
        public VideoService(IVideoReposioty videoReposioty)
        {
            _videoReposioty = videoReposioty;
        }
        public Task<List<Video>> GetAllVideos() => _videoReposioty.GetAllVideos();
        public Task<Video> GetVideoById(int videoId) => _videoReposioty.GetVideoById(videoId);
        public Task AddVideo(Video video) => _videoReposioty.AddVideo(video);
        public Task UpdateVideo(Video video) => _videoReposioty.UpdateVideo(video);
        public Task DeleteVideo(int videoId) => _videoReposioty.DeleteVideo(videoId);
        public Task<List<Video>> GetVideosByCategory(string category) => _videoReposioty.GetVideosByCategory(category);
        public Task<List<Video>> SearchVideos(string keyword) => _videoReposioty.SearchVideos(keyword);
    }
}
