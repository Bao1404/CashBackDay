using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CashBackObject.Models;

public partial class CashBackDayContext : DbContext
{
    public CashBackDayContext()
    {
    }

    public CashBackDayContext(DbContextOptions<CashBackDayContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AffiliateCommission> AffiliateCommissions { get; set; }

    public virtual DbSet<ContactRequest> ContactRequests { get; set; }

    public virtual DbSet<Conversation> Conversations { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<RefundRequest> RefundRequests { get; set; }

    public virtual DbSet<TradingFloor> TradingFloors { get; set; }

    public virtual DbSet<TransactionHistory> TransactionHistories { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Video> Videos { get; set; }

    public virtual DbSet<Wallet> Wallets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AffiliateCommission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Affiliat__3214EC073780FA91");

            entity.Property(e => e.CommissionAmount).HasColumnType("decimal(18, 8)");
            entity.Property(e => e.CommissionCurrency)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("USDT");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ExternalRef)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.ReportingAccountId)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Floor).WithMany(p => p.AffiliateCommissions)
                .HasForeignKey(d => d.FloorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Affiliate__Floor__35BCFE0A");
        });

        modelBuilder.Entity<ContactRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__ContactR__33A8517A81E7BB48");

            entity.Property(e => e.RequestCategory).HasMaxLength(200);
            entity.Property(e => e.RequesterEmail)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.RequesterName).HasMaxLength(50);
            entity.Property(e => e.RequesterPhone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Status).HasMaxLength(20);
        });

        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(e => e.ConversationId).HasName("PK__Conversa__C050D87765FE6A46");

            entity.HasIndex(e => e.UserId, "UQ_Conversation_User").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("Active");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithOne(p => p.Conversation)
                .HasForeignKey<Conversation>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Conversat__UserI__4E88ABD4");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Messages__C87C0C9C942EC7B1");

            entity.Property(e => e.AttachmentUrl).IsUnicode(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.MessageType)
                .HasMaxLength(20)
                .HasDefaultValue("text");

            entity.HasOne(d => d.Conversation).WithMany(p => p.Messages)
                .HasForeignKey(d => d.ConversationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Messages__Conver__5441852A");

            entity.HasOne(d => d.Receiver).WithMany(p => p.MessageReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Messages__Receiv__5629CD9C");

            entity.HasOne(d => d.Sender).WithMany(p => p.MessageSenders)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Messages__Sender__5535A963");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E12E6C9C5D5");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Notificat__UserI__47DBAE45");
        });

        modelBuilder.Entity<RefundRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__RefundRe__33A8517A19167DFC");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 8)");
            entity.Property(e => e.CryptoSymbol)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("USDT");
            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.PaymentTxId)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.RequestDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("Pending");

            entity.HasOne(d => d.User).WithMany(p => p.RefundRequests)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RefundReq__UserI__412EB0B6");
        });

        modelBuilder.Entity<TradingFloor>(entity =>
        {
            entity.HasKey(e => e.FloorId).HasName("PK__TradingF__49D1E84B2B860D7F");

            entity.HasIndex(e => e.FloorName, "UQ__TradingF__3D098F35A7862D08").IsUnique();

            entity.Property(e => e.FloorName).HasMaxLength(100);
            entity.Property(e => e.FloorUrl).IsUnicode(false);
            entity.Property(e => e.ImgUrl).IsUnicode(false);
            entity.Property(e => e.InviteCode)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.RefundPercentage).HasColumnType("decimal(5, 2)");
        });

        modelBuilder.Entity<TransactionHistory>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__Transact__55433A6BE96F718D");

            entity.ToTable("TransactionHistory");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CryptoSymbol)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ExternalRef)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.OriginalFee).HasColumnType("decimal(18, 8)");
            entity.Property(e => e.RebateFromExchange).HasColumnType("decimal(18, 8)");
            entity.Property(e => e.RefundToUser).HasColumnType("decimal(18, 8)");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("New");

            entity.HasOne(d => d.Floor).WithMany(p => p.TransactionHistories)
                .HasForeignKey(d => d.FloorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Transacti__Floor__3B75D760");

            entity.HasOne(d => d.User).WithMany(p => p.TransactionHistories)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Transacti__UserI__3A81B327");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CEFF0C9B9");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534F4E7E360").IsUnique();

            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.CreateAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasDefaultValue("User");
            entity.Property(e => e.Status).HasDefaultValue(true);
        });

        modelBuilder.Entity<Video>(entity =>
        {
            entity.HasKey(e => e.VideoId).HasName("PK__Videos__BAE5126A51781161");

            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Duration)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ImgUrl).IsUnicode(false);
            entity.Property(e => e.Title).HasMaxLength(100);
            entity.Property(e => e.VideoUrl).IsUnicode(false);
        });

        modelBuilder.Entity<Wallet>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Wallets__3214EC079BD8C5CF");

            entity.HasIndex(e => new { e.UserId, e.CryptoSymbol }, "UQ_Wallet_User_Crypto").IsUnique();

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 8)");
            entity.Property(e => e.CryptoSymbol)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("USDT");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.Wallets)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Wallets__UserId__30F848ED");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
