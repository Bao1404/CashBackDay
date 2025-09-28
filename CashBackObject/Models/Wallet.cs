using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class Wallet
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string CryptoSymbol { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
