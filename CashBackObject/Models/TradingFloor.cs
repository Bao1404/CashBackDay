using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class TradingFloor
{
    public int FloorId { get; set; }

    public string FloorName { get; set; } = null!;

    public string? InviteCode { get; set; }

    public byte[]? ApiKeyEncrypted { get; set; }

    public byte[]? ApiSecretEncrypted { get; set; }

    public string? ImgUrl { get; set; }

    public decimal? RefundPercentage { get; set; }

    public string? FloorUrl { get; set; }

    public string? FloorDescription { get; set; }

    public DateTime? AddedDate { get; set; }

    public virtual ICollection<AffiliateCommission> AffiliateCommissions { get; set; } = new List<AffiliateCommission>();

    public virtual ICollection<TransactionHistory> TransactionHistories { get; set; } = new List<TransactionHistory>();

    public virtual ICollection<UserLinkedFloor> UserLinkedFloors { get; set; } = new List<UserLinkedFloor>();
}
