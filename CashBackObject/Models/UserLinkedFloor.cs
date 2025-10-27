using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class UserLinkedFloor
{
    public int LinkedId { get; set; }

    public string UserUid { get; set; } = null!;

    public int? FloorId { get; set; }

    public int? UserId { get; set; }

    public virtual TradingFloor? Floor { get; set; }

    public virtual User? User { get; set; }
}
