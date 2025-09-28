using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class RefundRequest
{
    public int RequestId { get; set; }

    public int UserId { get; set; }

    public decimal Amount { get; set; }

    public string CryptoSymbol { get; set; } = null!;

    public DateTime? RequestDate { get; set; }

    public string? Status { get; set; }

    public string? PaymentTxId { get; set; }

    public string? Note { get; set; }

    public virtual User User { get; set; } = null!;
}
