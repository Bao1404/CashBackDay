using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CashBackObject.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TradingFloors",
                columns: table => new
                {
                    FloorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FloorName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    InviteCode = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    ApiKeyEncrypted = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ApiSecretEncrypted = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ImgUrl = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    RefundPercentage = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    FloorUrl = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    FloorDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AddedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TradingF__49D1E84B67ACAEE7", x => x.FloorId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Dob = table.Column<DateOnly>(type: "date", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    AvatarUrl = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "User"),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__1788CC4C62894B31", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Videos",
                columns: table => new
                {
                    VideoId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImgUrl = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Duration = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UploadDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalViews = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Videos__BAE5126A45E94D9F", x => x.VideoId);
                });

            migrationBuilder.CreateTable(
                name: "AffiliateCommissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FloorId = table.Column<int>(type: "int", nullable: false),
                    ExternalRef = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    ReportingAccountId = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    CommissionAmount = table.Column<decimal>(type: "decimal(18,8)", nullable: false),
                    CommissionCurrency = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false, defaultValue: "USDT"),
                    ReportedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Affiliat__3214EC07399D5C59", x => x.Id);
                    table.ForeignKey(
                        name: "FK__Affiliate__Floor__35BCFE0A",
                        column: x => x.FloorId,
                        principalTable: "TradingFloors",
                        principalColumn: "FloorId");
                });

            migrationBuilder.CreateTable(
                name: "RefundRequests",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,8)", nullable: false),
                    CryptoSymbol = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false, defaultValue: "USDT"),
                    RequestDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())"),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true, defaultValue: "Pending"),
                    PaymentTxId = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__RefundRe__33A8517A4A6E80A9", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK__RefundReq__UserI__412EB0B6",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "TransactionHistory",
                columns: table => new
                {
                    TransactionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FloorId = table.Column<int>(type: "int", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CryptoSymbol = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    OriginalFee = table.Column<decimal>(type: "decimal(18,8)", nullable: false),
                    RebateFromExchange = table.Column<decimal>(type: "decimal(18,8)", nullable: false),
                    RefundToUser = table.Column<decimal>(type: "decimal(18,8)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true, defaultValue: "New"),
                    ExternalRef = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Transact__55433A6B29D13DA9", x => x.TransactionId);
                    table.ForeignKey(
                        name: "FK__Transacti__Floor__3B75D760",
                        column: x => x.FloorId,
                        principalTable: "TradingFloors",
                        principalColumn: "FloorId");
                    table.ForeignKey(
                        name: "FK__Transacti__UserI__3A81B327",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Wallets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CryptoSymbol = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false, defaultValue: "USDT"),
                    Amount = table.Column<decimal>(type: "decimal(18,8)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Wallets__3214EC07DB2CF126", x => x.Id);
                    table.ForeignKey(
                        name: "FK__Wallets__UserId__30F848ED",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateCommissions_FloorId",
                table: "AffiliateCommissions",
                column: "FloorId");

            migrationBuilder.CreateIndex(
                name: "IX_RefundRequests_UserId",
                table: "RefundRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "UQ__TradingF__3D098F358623E5EC",
                table: "TradingFloors",
                column: "FloorName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TransactionHistory_FloorId",
                table: "TransactionHistory",
                column: "FloorId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionHistory_UserId",
                table: "TransactionHistory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__A9D105345D2AF8E6",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_Wallet_User_Crypto",
                table: "Wallets",
                columns: new[] { "UserId", "CryptoSymbol" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AffiliateCommissions");

            migrationBuilder.DropTable(
                name: "RefundRequests");

            migrationBuilder.DropTable(
                name: "TransactionHistory");

            migrationBuilder.DropTable(
                name: "Videos");

            migrationBuilder.DropTable(
                name: "Wallets");

            migrationBuilder.DropTable(
                name: "TradingFloors");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
