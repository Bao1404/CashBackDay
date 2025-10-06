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
            entity.HasKey(e => e.Id).HasName("PK__Affiliat__3214EC07B780D7AE");

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

        modelBuilder.Entity<RefundRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__RefundRe__33A8517A2A4FECC1");

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
            entity.HasKey(e => e.FloorId).HasName("PK__TradingF__49D1E84BE9D24A97");

            entity.HasIndex(e => e.FloorName, "UQ__TradingF__3D098F352D7D09E7").IsUnique();

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
            entity.HasKey(e => e.TransactionId).HasName("PK__Transact__55433A6BACE67D74");

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
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CA371B6EE");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D105346FE00A7E").IsUnique();

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
            entity.HasKey(e => e.VideoId).HasName("PK__Videos__BAE5126AFE6EA1C0");

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
            entity.HasKey(e => e.Id).HasName("PK__Wallets__3214EC07647B7D57");

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
