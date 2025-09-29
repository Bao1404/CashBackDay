using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class LogoutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost("/Logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            TempData["Message"] = "Đăng xuất thành công";
            TempData["Type"] = "success";
            return RedirectToAction("Index", "Home");
        }
    }
}
