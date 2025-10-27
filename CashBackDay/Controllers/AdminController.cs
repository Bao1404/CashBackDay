using CashBackObject.Models;
using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CashBackDay.Controllers
{
    public class AdminController : Controller
    {
        private readonly IUserService _userService;
        private readonly ITradingFloorService _tradingFloorService;
        private readonly IVideoService _videoService;
        private readonly IRequestService _requestService;
        private int? currentUser => HttpContext.Session.GetInt32("UserId");
        public AdminController(IUserService userService, ITradingFloorService tradingFloorService, IVideoService videoService, IRequestService requestService)
        {
            _userService = userService;
            _tradingFloorService = tradingFloorService;
            _videoService = videoService;
            _requestService = requestService;
        }
        public async Task<IActionResult> Index()
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if (user.Role != "Admin")
            {
                return RedirectToAction("Index", "Home");
            }
            ViewData["ActiveMenu"] = "Dashboard";
            return View();
        }
        public async Task<IActionResult> Messages()
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if (user.Role != "Admin")
            {
                return RedirectToAction("Index", "Home");
            }
            ViewData["ActiveMenu"] = "Messages";
            return View();
        }
        public async Task<IActionResult> ManageUser()
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if (user.Role != "Admin")
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.Users = await _userService.GetAllUsers();
            ViewData["ActiveMenu"] = "ManageUser";
            return View();
        }
        [HttpPost("/ban")]
        public async Task<IActionResult> Ban(IFormCollection form)
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if (user.Role != "Admin")
            {
                return RedirectToAction("Index", "Home");
            }
            var userId = int.Parse(form["userId"]);
            var userToBan = await _userService.GetUserById(userId);
            if (userToBan != null)
            {
                userToBan.IsBan = true;
                await _userService.UpdateAccount(userToBan);
            }
            return RedirectToAction("ManageUser", "Admin");
        }
        [HttpPost("/unban")]
        public async Task<IActionResult> Unban(IFormCollection form)
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if (user.Role != "Admin")
            {
                return RedirectToAction("Index", "Home");
            }
            var userId = int.Parse(form["userId"]);
            var userToUnban = await _userService.GetUserById(userId);
            if (userToUnban != null)
            {
                userToUnban.IsBan = false;
                await _userService.UpdateAccount(userToUnban);
            }
            return RedirectToAction("ManageUser", "Admin");
        }
        [HttpGet("/Search/User")]
        public async Task<IActionResult> SearchUser()
        {
            var input = Request.Query["input"];
            if (string.IsNullOrEmpty(input))
            {
                ViewBag.Users = await _userService.GetAllUsers();
                return PartialView("Partials/_ListUserPartial");
            }
            ViewBag.Users = await _userService.SearchUser(input);
            return PartialView("Partials/_ListUserPartial");
        }
        [HttpGet("/List/Status")]
        public async Task<IActionResult> ListStatus()
        {
            var status = Request.Query["status"];
            if (string.IsNullOrEmpty(status) || status == "all")
            {
                ViewBag.Users = await _userService.GetAllUsers();
                return PartialView("Partials/_ListUserPartial");
            }
            if (status.Equals("Hoạt động"))
            {
                var allUsers = await _userService.GetAllUsers();
                var filteredUsers = allUsers.Where(u => u.Status == true).ToList();
                ViewBag.Users = filteredUsers;
                return PartialView("Partials/_ListUserPartial");
            }
            else
            {
                var allUsers = await _userService.GetAllUsers();
                var filteredUsers = allUsers.Where(u => u.Status == false).ToList();
                ViewBag.Users = filteredUsers;
                return PartialView("Partials/_ListUserPartial");
            }
        }
        public async Task<IActionResult> ManageFloor()
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            List<TradingFloor> floors = await _tradingFloorService.GetAllTradingFloorsAsync();
            ViewBag.Floors = floors;

            ViewData["ActiveMenu"] = "ManageFloor";
            return View();
        }
        [HttpPut("/Floor/Edit")]
        public async Task<IActionResult> EditFloor(IFormCollection form)
        {
            try
            {
                var floorId = int.Parse(form["floorId"]);
                var floorName = form["floorName"];
                var refundPercentage = decimal.Parse(form["refundPercentage"]);
                var floorDescription = form["floorDescription"];
                var floorUrl = form["floorUrl"];
                var imgUrl = form["imgUrl"];
                var inviteCode = form["inviteCode"];
                
                var floors = await _tradingFloorService.GetAllTradingFloorsAsync();
                var floorToEdit = floors.FirstOrDefault(f => f.FloorId == floorId);
                if (floorToEdit != null)
                {
                    floorToEdit.FloorName = floorName;
                    floorToEdit.RefundPercentage = refundPercentage;
                    floorToEdit.FloorDescription = floorDescription;
                    floorToEdit.FloorUrl = floorUrl;
                    floorToEdit.ImgUrl = imgUrl;
                    floorToEdit.InviteCode = inviteCode;
                    await _tradingFloorService.EditFloor(floorToEdit);                   
                }
                ViewBag.Floors = await _tradingFloorService.GetAllTradingFloorsAsync();
                return PartialView("Partials/_ListFloorPartial");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }
        [HttpPost("/Floor/Add")]
        public async Task<IActionResult> AddFloor(IFormCollection form)
        {
                var floorName = form["floorName"];
                var refundPercentage = decimal.Parse(form["refundPercentage"]);
                var floorDescription = form["floorDescription"];
                var floorUrl = form["floorUrl"];
                var imgUrl = form["imgUrl"];
                var inviteCode = form["inviteCode"];
                TradingFloor newFloor = new TradingFloor
                {
                    FloorName = floorName,
                    RefundPercentage = refundPercentage,
                    FloorDescription = floorDescription,
                    FloorUrl = floorUrl,
                    ImgUrl = imgUrl,
                    InviteCode = inviteCode,
                    AddedDate = DateTime.Now
                };
                await _tradingFloorService.AddFloor(newFloor);
                ViewBag.Floors = await _tradingFloorService.GetAllTradingFloorsAsync();
                return PartialView("Partials/_ListFloorPartial");
            }
        [HttpDelete("/Floor/Delete")]
        public async Task<IActionResult> DeleteFloor(IFormCollection form)
        {
            try
            {
                var floorId = int.Parse(form["floorId"]);
                var floorToDelete = await _tradingFloorService.GetTradingFloorById(floorId);
                if (floorToDelete != null)
                {
                    await _tradingFloorService.DeleteFloor(floorId);
                }
                ViewBag.Floors = await _tradingFloorService.GetAllTradingFloorsAsync();
                return PartialView("Partials/_ListFloorPartial");
            }
            catch (Exception ex)
            {
                return PartialView("Partials/_ListFloorPartial");
            }
        }
        [HttpGet("/Floor/Search")]
        public async Task<IActionResult> SearchFloor()
        {
            var input = Request.Query["input"];
            if (string.IsNullOrEmpty(input))
            {
                ViewBag.Floors = await _tradingFloorService.GetAllTradingFloorsAsync();
                return PartialView("Partials/_ListFloorPartial");
            }
            ViewBag.Floors = await _tradingFloorService.GetFloorByName(input);
            return PartialView("Partials/_ListFloorPartial");
        }
        public async Task<IActionResult> ManageVideo()
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if (user.Role != "Admin")
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.Videos = await _videoService.GetAllVideos();
            ViewData["ActiveMenu"] = "ManageVideo";
            return View();
        }
        [HttpPut("/Video/Edit")]
        public async Task<IActionResult> EditVideo(IFormCollection form)
        {
            try
            {
                var videoId = int.Parse(form["videoId"]);
                var title = form["title"];
                var category = form["category"];
                var description = form["description"];
                var imgUrl = form["imgUrl"];
                var videoUrl = form["videoUrl"];

                var videos = await _videoService.GetAllVideos();
                var videoToEdit = videos.FirstOrDefault(f => f.VideoId == videoId);
                if (videoToEdit != null)
                {
                    videoToEdit.Title = title;
                    videoToEdit.Category = category;
                    videoToEdit.Description = description;
                    videoToEdit.VideoUrl = videoUrl;
                    videoToEdit.ImgUrl = imgUrl;
                    await _videoService.UpdateVideo(videoToEdit);
                }
                ViewBag.Videos = await _videoService.GetAllVideos();
                return PartialView("Partials/_ListVideoPartial");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }
        [HttpPost("/Video/Add")]
        public async Task<IActionResult> AddVideo(IFormCollection form)
        {
            var title = form["title"];
            var category = form["category"];
            var description = form["description"];
            var imgUrl = form["imgUrl"];
            var videoUrl = form["videoUrl"];

            Video newVideo = new Video
            {
                Title = title,
                Category = category,
                Description = description,
                VideoUrl = videoUrl,
                ImgUrl = imgUrl,
                UploadDate = DateTime.Now
            };
            await _videoService.AddVideo(newVideo);
            ViewBag.Videos = await _videoService.GetAllVideos();
            return PartialView("Partials/_ListVideoPartial");
        }
        [HttpDelete("/Video/Delete")]
        public async Task<IActionResult> DeleteVideo(IFormCollection form)
        {
            try
            {
                var videoId = int.Parse(form["videoId"]);
                var videToDelete = await _videoService.GetVideoById(videoId);
                if (videToDelete != null)
                {
                    await _videoService.DeleteVideo(videoId);
                }
                ViewBag.Videos = await _videoService.GetAllVideos();
                return PartialView("Partials/_ListVideoPartial");
            }
            catch (Exception ex)
            {
                return PartialView("Partials/_ListVideoPartial");
            }
        }
        [HttpGet("/Video/Search")]
        public async Task<IActionResult> SearchVideo()
        {
            var input = Request.Query["input"];
            if (string.IsNullOrEmpty(input))
            {
                ViewBag.Videos = await _videoService.GetAllVideos();
                return PartialView("Partials/_ListVideoPartial");
            }
            ViewBag.Videos = await _videoService.SearchVideos(input);
            return PartialView("Partials/_ListVideoPartial");
        }
        public async Task<IActionResult> ManageRequest()
        {
            if(currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            ViewBag.Requests = await _requestService.GetAllContactRequests();
            ViewData["ActiveMenu"] = "ManageRequest";
            return View();
        }
        [HttpPost("/Request/Update")]
        public async Task<IActionResult> MarkAsRead(IFormCollection form)
        {
            var requestId = int.Parse(form["requestId"]);
            var request = (await _requestService.GetAllContactRequests()).FirstOrDefault(r => r.RequestId == requestId);
            if(request != null)
            {
                request.Status = "Đã đọc";
                await _requestService.UpdateContactRequest(request);
            }
            ViewBag.Requests = await _requestService.GetAllContactRequests();
            return RedirectToAction("ManageRequest", "Admin");
        }
        public IActionResult ManageAffiliate()
        {
            ViewData["ActiveMenu"] = "ManageAffiliate";
            return View();
        }
        public IActionResult ManageRefund()
        {
            ViewData["ActiveMenu"] = "ManageRefund";
            return View();
        }
    }
}
