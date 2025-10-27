using CashBackObject.Models;
using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CashBackDay.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly ITradingFloorService _tradingFloorService;
        private readonly IVideoService _videoService;
        private readonly IRequestService _requestService;
        private readonly ILinkedFloorService _linkedFloorService;
        private int? currentUser => HttpContext.Session.GetInt32("UserId");
        public UserController(IUserService userService, ITradingFloorService tradingFloorService, IVideoService videoService, IRequestService requestService, ILinkedFloorService linkedFloorService)
        {
            _userService = userService;
            _tradingFloorService = tradingFloorService;
            _videoService = videoService;
            _requestService = requestService;
            _linkedFloorService = linkedFloorService;
        }
        public IActionResult Contact()
        {
            ViewData["ActiveMenu"] = "ContactPage";
            return View();
        }
        [HttpPost("/SendRequest")]
        public async Task<IActionResult> SendContactRequest(IFormCollection form)
        {
            var name = form["name"];
            var email = form["email"];
            var phone = form["phone"];
            var category = form["category"];
            var message = form["message"];

            var request = new ContactRequest
            {
                RequesterName = name,
                RequesterEmail = email,
                RequesterPhone = phone,
                RequestCategory = category,
                RequestContent = message,
                CreateAt = DateTime.Now,
                Status = "Chưa đọc"
            };
            await _requestService.CreateContactRequest(request);
            TempData["Message"] = "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.";
            TempData["Type"] = "success";
            return RedirectToAction("Contact", "User");
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
        public async Task<IActionResult> TradingFloor()
        {
            if(currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var list = await _linkedFloorService.GetLinkedFloorByUserId(currentUser.Value);
            ViewBag.LinkedFloors = list.Select(x => x.FloorId).ToList();
            ViewBag.Floors =  _tradingFloorService.GetAllTradingFloorsAsync().Result;
            ViewData["ActiveMenu"] = "FloorPage";
            return View();
        }
        [HttpPost("add-linked-floor")]
        public async Task<IActionResult> AddLinkedFloor(IFormCollection form)
        {
            var floorId = int.Parse(form["floorId"]);
            var userId = currentUser.Value;
            var uid = form["uid"];
            try
            {
                var linkedFloor = new UserLinkedFloor
                {
                    FloorId = floorId,
                    UserId = userId,
                    UserUid = uid,
                };
                await _linkedFloorService.AddUserLinkedFloor(linkedFloor);
                TempData["Message"] = "Liên kết sàn giao dịch thành công";
                TempData["Type"] = "success";
                return RedirectToAction("TradingFloor", "User");
            }
            catch (Exception ex)
            {
                TempData["Message"] = ex.ToString();
                TempData["Type"] = "error";
                return RedirectToAction("TradingFloor", "User");
            }
        }
        [HttpPost("update-uid")]
        public async Task<IActionResult> UpdateUid(IFormCollection form)
        {
            var floorId = int.Parse(form["floorId"]);
            var userId = currentUser.Value;
            var uid = form["uid"];
            try
            {
                var linkedFloor = await _linkedFloorService.GetLinkedFloorByUserIdAndFloorId(currentUser.Value, floorId);
                if (linkedFloor != null)
                {
                    linkedFloor.UserUid = uid;
                    await _linkedFloorService.UpdateUserLinkedFloor(linkedFloor);
                    TempData["Message"] = "Cập nhật UID thành công";
                    TempData["Type"] = "success";
                    return RedirectToAction("TradingFloor", "User");
                }
                TempData["Message"] = "Cập nhật UID thất bại";
                TempData["Type"] = "error";
                return RedirectToAction("TradingFloor", "User");
            }
            catch (Exception ex)
            {
                TempData["Message"] = ex.ToString();
                TempData["Type"] = "error";
                return RedirectToAction("TradingFloor", "User");
            }
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
