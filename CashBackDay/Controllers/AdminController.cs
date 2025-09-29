using CashBackObject.Models;
using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CashBackDay.Controllers
{
    public class AdminController : Controller
    {
        private readonly IUserService _userService;
        private int? currentUser => HttpContext.Session.GetInt32("UserId");
        public AdminController(IUserService userService)
        {
            _userService = userService;
        }
        public async Task<IActionResult> Index()
        {
            if(currentUser == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(currentUser.Value);
            if(user.Role != "Admin")
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
            if(userToBan != null)
            {
                userToBan.Status = false;
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
                userToUnban.Status = true;
                await _userService.UpdateAccount(userToUnban);
            }
            return RedirectToAction("ManageUser", "Admin");
        }
        [HttpGet("/Search/User")]
        public async Task<IActionResult> SearchUser()
        {
            var input = Request.Query["input"];
            if(string.IsNullOrEmpty(input))
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
            if(string.IsNullOrEmpty(status) || status == "all")
            {
                ViewBag.Users = await _userService.GetAllUsers();
                return PartialView("Partials/_ListUserPartial");
            }
            if(status.Equals("Hoạt động"))
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
    }
}
