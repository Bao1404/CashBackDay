using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class TurtorialsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
