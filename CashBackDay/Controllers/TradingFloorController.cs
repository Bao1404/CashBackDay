using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class TradingFloorController : Controller
    {
        private readonly ITradingFloorService _tradingFloorService;
        public TradingFloorController(ITradingFloorService tradingFloorService)
        {
            _tradingFloorService = tradingFloorService;
        }
        public async Task<IActionResult> Index()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if(userId == null)
            {
                return RedirectToAction("Index", "Login");
            }

            var tradingFloors = await _tradingFloorService.GetAllTradingFloorsAsync();
            if(tradingFloors != null && tradingFloors.Count > 0)
            {
                ViewBag.TradingFloors = tradingFloors;
            }
            else
            {
                ViewBag.Message = "Không có sàn khả dụng!";
            }
            return View();
        }
    }
}
