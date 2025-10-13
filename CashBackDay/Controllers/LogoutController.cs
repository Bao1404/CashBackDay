using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CashBackDay.Controllers
{
    public class LogoutController : Controller
    {
        private readonly IUserService _userService;
        public LogoutController(IUserService userService)
        {
            _userService = userService;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost("/Logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if(userId != null)
            {
                var user = await _userService.GetUserById(userId.Value);
                if(user != null)
                {
                    user.Status = false;
                    await _userService.UpdateAccount(user);
                }
            }
            HttpContext.Session.Clear();
            TempData["Message"] = "Đăng xuất thành công";
            TempData["Type"] = "success";
            return RedirectToAction("Index", "Home");
        }
    }
}
