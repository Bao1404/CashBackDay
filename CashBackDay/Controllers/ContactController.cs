using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class ContactController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
