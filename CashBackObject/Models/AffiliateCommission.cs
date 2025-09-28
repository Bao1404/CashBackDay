using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class AffiliateCommission
{
    public int Id { get; set; }

    public int FloorId { get; set; }

    public string ExternalRef { get; set; } = null!;

    public string? ReportingAccountId { get; set; }

    public decimal CommissionAmount { get; set; }

    public string CommissionCurrency { get; set; } = null!;

    public DateTime ReportedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual TradingFloor Floor { get; set; } = null!;
}
