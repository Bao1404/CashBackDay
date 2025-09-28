using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class WalletController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
