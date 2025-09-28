using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? Phone { get; set; }

    public DateOnly? Dob { get; set; }

    public string? Gender { get; set; }

    public string? AvatarUrl { get; set; }

    public DateTime? CreateAt { get; set; }

    public string? Role { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<RefundRequest> RefundRequests { get; set; } = new List<RefundRequest>();

    public virtual ICollection<TransactionHistory> TransactionHistories { get; set; } = new List<TransactionHistory>();

    public virtual ICollection<Wallet> Wallets { get; set; } = new List<Wallet>();
}
