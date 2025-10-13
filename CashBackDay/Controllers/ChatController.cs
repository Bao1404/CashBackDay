using CashBackDay.DTO;
using CashBackObject.Models;
using CashBackService.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CashBackDay.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IConversationService _conversationService;
        private readonly IMessageService _messageService;
        public ChatController(IConversationService conversationService, IMessageService messageService)
        {
            _conversationService = conversationService;
            _messageService = messageService;
        }
        [HttpGet("conversations/{id}")]
        public async Task<IActionResult> GetConversationsById(int id)
        {
            var conversations = await _conversationService.GetConversationById(id);
            var conversationDTO = new ConversationDTO
            {
                ConversationId = conversations.ConversationId,
                UserId = conversations.UserId,
                UserName = conversations.User.FullName,
                UserAvatar = conversations.User.AvatarUrl,
                UserStatus = conversations.User.Status,
                CreatedAt = conversations.CreatedAt,
                UpdatedAt = conversations.UpdatedAt,
                Status = conversations.Status
            };
            return Ok(conversationDTO);
        }
        [HttpGet("conversations")]
        public async Task<IActionResult> GetAllConversations()
        {
            var conversations = await _conversationService.GetAllConversation();
            var conversationDTOs = conversations.Select(c => new ConversationDTO
            {
                ConversationId = c.ConversationId,
                UserId = c.UserId,
                UserName = c.User.FullName,
                UserAvatar = c.User.AvatarUrl,
                UserStatus = c.User.Status,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                Status = c.Status
            }).ToList();
            return Ok(conversationDTOs);
        }
        [HttpPost("conversations")]
        public async Task<IActionResult> CreateConversation([FromBody] ConversationDTO conversation)
        {
            var conversationModel = new Conversation
            {
                UserId = conversation.UserId,
                CreatedAt = conversation.CreatedAt,
                UpdatedAt = conversation.UpdatedAt,
                Status = conversation.Status
            };
            var createdConversation = await _conversationService.CreateConversation(conversationModel);
            return Ok(createdConversation);
        }
        [HttpGet("messages/{conversationId}")]
        public async Task<IActionResult> GetMessagesByConversationId(int conversationId)
        {
            var messages = await _messageService.GetMessageByConversationId(conversationId);
            var MessageDTOs = messages.Select(m => new MessageDTO
            {
                MessageId = m.MessageId,
                ConversationId = m.ConversationId,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                Content = m.Content,
                MessageType = m.MessageType,
                AttachmentUrl = m.AttachmentUrl,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            }).ToList();
            return Ok(MessageDTOs);
        }
        [HttpPost("messages")]
        public async Task<IActionResult> CreateMessage([FromBody] MessageDTO message)
        {
            var messageModel = new Message
            {
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                MessageType = message.MessageType,
                AttachmentUrl = message.AttachmentUrl,
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt
            };
            var createdMessage = await _messageService.CreateMessage(messageModel);
            return Ok(createdMessage);
        }
    }
}
