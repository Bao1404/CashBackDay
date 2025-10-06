namespace CashBackDay.DTO
{
    public class ConversationDTO
    {
        public int ConversationId { get; set; }
        public int UserId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Status { get; set; }
    }
}
