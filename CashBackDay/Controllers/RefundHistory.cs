using CashBackService.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    public class RefundHistory : Controller
    {
        private readonly ITransactionHistoryService _transactionService;
        public RefundHistory(ITransactionHistoryService transactionService)
        {
            _transactionService = transactionService;
        }
        public async Task<IActionResult> Index()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if(userId == null)
            {
                return RedirectToAction("Index", "Login");
            }

            var transaction = await _transactionService.GetTransactionByUserId(userId.Value);
            if (transaction == null)
            {
                ViewBag.Message = "Không có giao dịch hoàn tiền nào.";
            }
            else
            {
                ViewBag.Transaction = await _transactionService.GetAllTransactionByUserId(userId.Value);
            }

            return View();
        }
    }
}
