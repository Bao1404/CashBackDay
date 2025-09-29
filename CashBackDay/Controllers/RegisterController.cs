using CashBackDay.Models;
using CashBackObject.Models;
using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class RegisterController : Controller
    {
        private readonly IUserService _userService;
        public RegisterController(IUserService userService)
        {
            _userService = userService;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost("/Register")]
        public async Task<IActionResult> Register(RegisterViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return View("Index", vm);
            }

            var existingEmail = await _userService.CheckEmailExist(vm.Email);
            if (existingEmail != null)
            {
                ViewBag.ErrorMessage = "Email này đã được đăng ký";
                return View("Index", vm);
            }

            var existingPhone = await _userService.CheckPhoneExist(vm.PhoneNumber);
            if (existingPhone != null)
            {
                ViewBag.ErrorMessage = "Số điện thoại này đã được đăng ký";
                return View("Index", vm);
            }

            var user = new User
            {
                Email = vm.Email,
                FullName = vm.FullName,
                Phone = vm.PhoneNumber,
                PasswordHash = vm.Password,
                CreateAt = DateTime.Now,
                AvatarUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/large_2x/default-avatar-icon-of-social-media-user-vector.jpg",
                Role = "User"
            };

            await _userService.CreateAccount(user);

            return RedirectToAction("Index", "Login");
        }
    }
}
