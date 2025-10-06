using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class ContactRequest
{
    public int RequestId { get; set; }

    public string? RequesterName { get; set; }

    public string? RequesterEmail { get; set; }

    public string? RequesterPhone { get; set; }

    public string? RequestCategory { get; set; }

    public string? RequestContent { get; set; }

    public DateTime? CreateAt { get; set; }

    public string? Status { get; set; }
}
