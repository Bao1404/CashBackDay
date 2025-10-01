using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly ITradingFloorService _tradingFloorService;
        private readonly IVideoService _videoService;
        private int? currentUser => HttpContext.Session.GetInt32("UserId");
        public UserController(IUserService userService, ITradingFloorService tradingFloorService, IVideoService videoService)
        {
            _userService = userService;
            _tradingFloorService = tradingFloorService;
            _videoService = videoService;
        }
        public IActionResult Contact()
        {
            ViewData["ActiveMenu"] = "ContactPage";
            return View();
        }
        public async Task<IActionResult> Profile()
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var profile = await _userService.GetUserById(currentUser.Value);
            return View(profile);
        }
        [HttpPost("/Edit")]
        public async Task<IActionResult> Edit(IFormCollection form)
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if (user == null)
            {
                return RedirectToAction("Index", "Login");
            }
            user.FullName = form["fullName"];
            user.Phone = form["phone"];
            user.AvatarUrl = form["avatarUrl"];

            DateOnly? dob = null;
            var dobString = form["dob"].ToString();
            if (!string.IsNullOrEmpty(dobString))
            {
                dob = DateOnly.Parse(dobString);
            }
            user.Gender = form["gender"];

            if (dob.HasValue && DateTime.Now.Year - dob.Value.Year >= 15)
            {
                user.Dob = dob;
                await _userService.UpdateAccount(user);
                TempData["Message"] = "Chỉnh sửa thành công";
                TempData["Type"] = "success";
                return RedirectToAction("Profile", "User");
            }
            else
            {
                await _userService.UpdateAccount(user);
                TempData["Message"] = "Tuổi phải lớn hơn 15";
                TempData["Type"] = "error";
                return RedirectToAction("Profile", "User");
            }
        }
        [HttpPost("/ChangePassword")]
        public async Task<IActionResult> ChangePassword(IFormCollection form)
        {
            if (currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if (user == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var currentPassword = form["currentPassword"];
            var newPassword = form["newPassword"];
            var confirmPassword = form["confirmPassword"];
            if (!user.PasswordHash.Equals(currentPassword))
            {
                TempData["Message"] = "Mật khẩu hiện tại không đúng";
                TempData["Type"] = "error";
                return RedirectToAction("Index", "Profile");
            }
            if (!newPassword.Equals(confirmPassword))
            {
                TempData["Message"] = "Mật khẩu mới không khớp";
                TempData["Type"] = "error";
                return RedirectToAction("Index", "Profile");
            }
            user.PasswordHash = newPassword;
            await _userService.UpdateAccount(user);
            TempData["Message"] = "Đổi mật khẩu thành công";
            TempData["Type"] = "success";
            return RedirectToAction("Index", "Profile");
        }
        public IActionResult RefundHistory()
        {
            if(currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }   
            ViewData["ActiveMenu"] = "RefundPage";
            return View();
        }
        public IActionResult TradingFloor()
        {
            if(currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            ViewBag.Floors =  _tradingFloorService.GetAllTradingFloorsAsync().Result;
            ViewData["ActiveMenu"] = "FloorPage";
            return View();
        }
        public async Task<IActionResult> Turtorial()
        {
            if(currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            ViewBag.Videos = await _videoService.GetAllVideos();
            ViewData["ActiveMenu"] = "TurtorialPage";
            return View();
        }
    }
}
