using CashBackObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashBackDAO
{
    public class VideoDAO
    {
        private readonly CashBackDayContext _context;
        public VideoDAO(CashBackDayContext context)
        {
            _context = context;
        }
        public async Task<List<CashBackObject.Models.Video>> GetAllVideos()
        {
            return await Task.FromResult(_context.Videos.ToList());
        }
        public async Task<Video> GetVideoById(int videoId)
        {
            return await Task.FromResult(_context.Videos.FirstOrDefault(v => v.VideoId == videoId));
        }
        public async Task AddVideo(Video video)
        {
            _context.Videos.Add(video);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateVideo(Video video)
        {
            _context.Videos.Update(video);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteVideo(int videoId)
        {
            var video = await GetVideoById(videoId);
            if (video != null)
            {
                _context.Videos.Remove(video);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<Video>> GetVideosByCategory(string category)
        {
            return await Task.FromResult(_context.Videos.Where(v => v.Category == category).ToList());
        }
        public async Task<List<Video>> SearchVideos(string keyword)
        {
            return await Task.FromResult(_context.Videos.Where(v => v.Title.Contains(keyword) || v.Description.Contains(keyword) || v.Category.Contains(keyword)).ToList());
        }
    }
}
