using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace CashBackDay.Hubs
{
    public class ChatHub : Hub
    {
        // Gửi tin nhắn đến 1 user cụ thể
        public async Task SendMessageToUser(string userId, string message)
        {
            await Clients.User(userId).SendAsync("ReceiveMessage", "admin", message, DateTime.Now);
        }

        // Gửi tin nhắn từ user đến admin
        public async Task SendMessageToAdmin(string message)
        {
            await Clients.Group("Admins").SendAsync("ReceiveMessage", Context.UserIdentifier, message, DateTime.Now);
        }

        // Khi admin kết nối → thêm vào nhóm Admins
        public override async Task OnConnectedAsync()
        {
            var isAdmin = Context.User?.IsInRole("Admin") ?? false;
            if (isAdmin)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
            }
            await base.OnConnectedAsync();
        }
    }
}
