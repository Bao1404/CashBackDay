using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using CashBackService.Interfaces;
using CashBackObject.Models;

namespace CashBackDay.Hubs
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _connections = new();
        private readonly IConversationService _conversationService;
        private readonly IMessageService _messageService;
        private readonly IUserService _userService;

        public ChatHub(
            IConversationService conversationService, 
            IMessageService messageService,
            IUserService userService)
        {
            _conversationService = conversationService;
            _messageService = messageService;
            _userService = userService;
        }

        // User sends message to admin
        public async Task SendMessageToAdmin(int userId, string message)
        {
            try
            {
                // Get or create conversation
                var conversations = await _conversationService.GetAllConversation();
                var conversation = conversations.FirstOrDefault(c => c.UserId == userId && c.Status == "Active");
                
                if (conversation == null)
                {
                    conversation = await _conversationService.CreateConversation(new Conversation
                    {
                        UserId = userId,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        Status = "Active"
                    });
                }

                // Get admin user
                var users = await _userService.GetAllUsers();
                var admin = users.FirstOrDefault(u => u.Role == "Admin");
                if (admin == null) return;

                // Create message in database
                var newMessage = await _messageService.CreateMessage(new Message
                {
                    ConversationId = conversation.ConversationId,
                    SenderId = userId,
                    ReceiverId = admin.UserId,
                    Content = message,
                    MessageType = "text",
                    IsRead = false,
                    CreatedAt = DateTime.Now
                });

                // Update conversation timestamp
                conversation.UpdatedAt = DateTime.Now;

                // Get user info
                var user = await _userService.GetUserById(userId);

                // Notify all admins in real-time
                await Clients.Group("Admins").SendAsync("ReceiveUserMessage", 
                    userId,
                    user?.FullName ?? "User",
                    user?.AvatarUrl ?? "/placeholder.svg",
                    message, 
                    newMessage.CreatedAt,
                    newMessage.MessageId,
                    conversation.ConversationId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SendMessageToAdmin: {ex.Message}");
                await Clients.Caller.SendAsync("Error", "Không thể gửi tin nhắn");
            }
        }

        // Admin sends message to user
        public async Task SendMessageFromAdmin(int conversationId, int adminId, int userId, string message)
        {
            try
            {
                // Create message in database
                var newMessage = await _messageService.CreateMessage(new Message
                {
                    ConversationId = conversationId,
                    SenderId = adminId,
                    ReceiverId = userId,
                    Content = message,
                    MessageType = "text",
                    IsRead = false,
                    CreatedAt = DateTime.Now
                });

                // Update conversation timestamp
                var conversation = await _conversationService.GetConversationById(conversationId);
                if (conversation != null)
                {
                    conversation.UpdatedAt = DateTime.Now;
                    await _conversationService.UpdateConversation(conversation); // THÊM dòng này
                }

                // Send to specific user in real-time
                if (_connections.TryGetValue(userId.ToString(), out var userConnectionId))
                {
                    await Clients.Client(userConnectionId).SendAsync("ReceiveAdminMessage", 
                        message, 
                        newMessage.CreatedAt,
                        newMessage.MessageId);
                }

                // Confirm to admin
                await Clients.Caller.SendAsync("MessageSent", newMessage.MessageId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SendMessageFromAdmin: {ex.Message}");
                await Clients.Caller.SendAsync("Error", "Không thể gửi tin nhắn");
            }
        }

        // User typing notification
        public async Task UserTyping(int userId, bool isTyping)
        {
            var user = await _userService.GetUserById(userId);
            await Clients.Group("Admins").SendAsync("UserTypingStatus", 
                userId, 
                user?.FullName ?? "User",
                isTyping);
        }

        // Admin typing notification
        public async Task AdminTyping(int userId, bool isTyping)
        {
            if (_connections.TryGetValue(userId.ToString(), out var userConnectionId))
            {
                await Clients.Client(userConnectionId).SendAsync("AdminTypingStatus", isTyping);
            }
        }

        // Admin marks messages as read
        public async Task MarkConversationAsRead(int conversationId, int adminId)
        {
            try
            {
                await _messageService.MarkMessagesAsRead(conversationId, adminId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error marking messages as read: {ex.Message}");
            }
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext?.Session.GetInt32("UserId");
            var userRole = httpContext?.Session.GetString("Role");

            Console.WriteLine($"User connected: UserId={userId}, Role={userRole}"); // Debug log

            if (userId.HasValue)
            {
                var userIdStr = userId.Value.ToString();
                _connections.TryAdd(userIdStr, Context.ConnectionId);

                if (userRole == "Admin")
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
                    Console.WriteLine($"Admin {userId.Value} added to Admins group"); // Debug log
                    await Clients.Group("Admins").SendAsync("AdminConnected", userId.Value);
                }
                else
                {
                    // Get user info
                    var user = await _userService.GetUserById(userId.Value);
                    
                    // Notify admins about new user connection
                    await Clients.Group("Admins").SendAsync("UserConnected", 
                        userId.Value, 
                        user?.FullName ?? "User", 
                        user?.AvatarUrl ?? "/placeholder.svg",
                        DateTime.Now);
                }
            }
            else
            {
                Console.WriteLine("User connected without UserId in session"); // Debug log
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext?.Session.GetInt32("UserId");
            var userRole = httpContext?.Session.GetString("Role");

            if (userId.HasValue)
            {
                var userIdStr = userId.Value.ToString();
                _connections.TryRemove(userIdStr, out _);

                if (userRole == "Admin")
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
                    await Clients.Group("Admins").SendAsync("AdminDisconnected", userId.Value);
                }
                else
                {
                    await Clients.Group("Admins").SendAsync("UserDisconnected", userId.Value, DateTime.Now);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
