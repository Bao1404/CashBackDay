using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class ProfileController : Controller
    {
        private readonly IUserService _userService;
        public ProfileController(IUserService userService)
        {
            _userService = userService;
        }
        public async Task<IActionResult> Index()
        {
            var user = HttpContext.Session.GetInt32("UserId");
            if(user == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var profile = await _userService.GetUserById(user.Value);

            return View(profile);
        }
        [HttpPost("/Edit")]
        public async Task<IActionResult> Edit(IFormCollection form)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return RedirectToAction("Index", "Login");
            }
            var user = await _userService.GetUserById(userId.Value);
            if(user == null)
            {
                return RedirectToAction("Index", "Login");
            }
            user.FullName = form["fullName"];
            user.Phone = form["phone"];
            user.AvatarUrl = form["avatarUrl"];
            user.Dob = string.IsNullOrEmpty(form["dob"]) ? null : DateOnly.Parse(form["dob"]);
            user.Gender = form["gender"];

            await _userService.UpdateAccount(user);

            return RedirectToAction("Index", "Profile");
        }
    }
}
