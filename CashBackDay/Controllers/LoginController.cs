using CashBackObject.Models;
using CashBackService.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CashBackDay.Controllers
{
    public class LoginController : Controller
    {
        private readonly IUserService _userService;
        public LoginController(IUserService userService)
        {
            _userService = userService;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost("/Login")]
        public async Task<IActionResult> Login(IFormCollection form)
        {
            var email = form["email"].ToString();
            var password = form["password"].ToString();

            try
            {
                var user = await _userService.GetUserLogin(email, password);
                if (user != null)
                {
                    HttpContext.Session.SetInt32("UserId", user.UserId);
                    HttpContext.Session.SetString("UserName", user.FullName);
                    HttpContext.Session.SetString("AvatarUrl", user.AvatarUrl ?? string.Empty);
                    if (user.Email.Equals("lethebao1404@gmail.com"))
                    {
                        return RedirectToAction("ManageUser", "Admin");
                    }
                    else
                    {
                        TempData["Message"] = "Đăng nhập thành công";
                        TempData["Type"] = "success";
                        return RedirectToAction("Index", "Home");
                    }
                }
                TempData["Message"] = "Sai tài khoản hoặc mật khẩu";
                TempData["Type"] = "error";
                return RedirectToAction("Index", "Login");
            }
            catch (Exception ex)
            {
                TempData["Message"] = "Có lỗi xảy ra";
                TempData["Type"] = "error";
                return RedirectToAction("Index", "Login");
            }
        }
        //Start Google Login
        [HttpGet("/ExternalLogin")]
        public IActionResult ExternalLogin(string provider = GoogleDefaults.AuthenticationScheme, string returnUrl = "/")
        {
            try
            {
                var redirectUrl = Url.Action(nameof(GoogleResponse), new { ReturnUrl = returnUrl });
                var properties = new AuthenticationProperties { RedirectUri = redirectUrl ?? "/" };
                return Challenge(properties, provider);
            }
            catch(Exception ex)
            {
                TempData["Message"] = "Có lỗi xảy ra";
                TempData["Type"] = "error";
                return RedirectToAction("Index", "Login");
            }
        }
        //Callback endpoint after google login
        [HttpGet("/GoogleResponse")]
        public async Task<IActionResult> GoogleResponse(string returnUrl = "/")
        {
            // After Google challenge, user will be signed in to the cookie scheme (because DefaultSignInScheme is cookies).
            try
            {
                var userPrincipal = HttpContext.User;
                if (userPrincipal?.Identity?.IsAuthenticated != true)
                {
                    return RedirectToAction("Login", "Index");
                }

                var email = userPrincipal.FindFirst(ClaimTypes.Email)?.Value;
                var name = userPrincipal.FindFirst(ClaimTypes.Name)?.Value ?? userPrincipal.Identity.Name;
                var phone = userPrincipal.FindFirst(ClaimTypes.MobilePhone)?.Value;
                var dob = userPrincipal.FindFirst(ClaimTypes.DateOfBirth)?.Value;
                var avatar = userPrincipal.FindFirst("picture")?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    TempData["Message"] = "Không thể lấy mail từ Google.";
                    TempData["Type"] = "danger";
                    return View("Index");
                }

                var existingUser = await _userService.CheckEmailExist(email);
                if (existingUser == null)
                {
                    var user = new User
                    {
                        Email = email,
                        FullName = name,
                        PasswordHash = Guid.NewGuid().ToString(), // Random password, user won't use it
                        Phone = phone,
                        Dob = string.IsNullOrEmpty(dob) ? (DateOnly?)null : DateOnly.Parse(dob),
                        AvatarUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/large_2x/default-avatar-icon-of-social-media-user-vector.jpg",
                        Role = "User",
                        Status = true,
                        CreateAt = DateTime.UtcNow,
                    };
                    await _userService.CreateAccount(user);
                    existingUser = await _userService.CheckEmailExist(email);
                }
                HttpContext.Session.SetInt32("UserId", existingUser.UserId);
                HttpContext.Session.SetString("UserName", existingUser.FullName ?? string.Empty);
                HttpContext.Session.SetString("AvatarUrl", existingUser.AvatarUrl ?? string.Empty);
                if (existingUser.Email.Equals("lethebao1404@gmail.com"))
                {
                    return RedirectToAction("ManageUser", "Admin");
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            catch(Exception ex)
            {
                TempData["Message"] = "Có lỗi xảy ra";
                TempData["Type"] = "error";
                return RedirectToAction("Index", "Login");
            }
        }
    }
}
