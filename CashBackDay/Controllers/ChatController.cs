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
            return Ok(conversations);
        }
        [HttpGet("conversations")]
        public async Task<IActionResult> GetAllConversations()
        {
            var conversations = await _conversationService.GetAllConversation();
            return Ok(conversations);
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
            return Ok(messages);
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
