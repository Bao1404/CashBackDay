using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class TransactionHistory
{
    public int TransactionId { get; set; }

    public int? UserId { get; set; }

    public int FloorId { get; set; }

    public DateTime TransactionDate { get; set; }

    public string CryptoSymbol { get; set; } = null!;

    public decimal OriginalFee { get; set; }

    public decimal RebateFromExchange { get; set; }

    public decimal RefundToUser { get; set; }

    public string? Status { get; set; }

    public string? ExternalRef { get; set; }

    public string? Note { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual TradingFloor Floor { get; set; } = null!;

    public virtual User? User { get; set; }
}
