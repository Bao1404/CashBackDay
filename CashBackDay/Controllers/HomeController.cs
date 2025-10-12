using System.Diagnostics;
using CashBackDay.Models;
using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ITradingFloorService _tradingFloorService;

        public HomeController(ILogger<HomeController> logger, ITradingFloorService tradingFloorService)
        {
            _logger = logger;
            _tradingFloorService = tradingFloorService;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["ActiveMenu"] = "HomePage";
            ViewBag.TradingFloors = await _tradingFloorService.GetAllTradingFloorsAsync();
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
