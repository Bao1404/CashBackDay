using CashBackDAO;
using CashBackObject.Models;
using CashBackRepositories.Interfaces;
using CashBackRepositories.Repositories;
using CashBackService.Interfaces;
using CashBackService.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Web;

namespace CashBackDay
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            builder.Services.AddDbContext<CashBackDayContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("CashBackDB")));

            builder.Services.AddScoped<UserDAO>();
            builder.Services.AddScoped<TransactionHistoryDAO>();
            builder.Services.AddScoped<TradingFloorDAO>();
            builder.Services.AddScoped<VideoDAO>();
            builder.Services.AddScoped<ContactRequestDAO>();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ITransactionRepository, TransactionHistoryRepository>();
            builder.Services.AddScoped<ITradingFloorRepository, TradingFloorRepository>();
            builder.Services.AddScoped<IVideoReposioty, VideoRepository>();
            builder.Services.AddScoped<IRequestRepository, RequestRepository>();

            builder.Services.AddScoped<ITransactionHistoryService, TransactionService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<ITradingFloorService, TradingFloorService>();
            builder.Services.AddScoped<IVideoService, VideoService>();
            builder.Services.AddScoped<IRequestService, RequestService>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
            .AddCookie()
                .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
                {
                    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
                    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
                    options.Scope.Add("profile");
                    options.Scope.Add("email");
                    options.SaveTokens = true;
                    options.ClaimActions.MapJsonKey("picture", "picture", "url");
                });

            // Replace the incorrect AddSession() usage with the correct overload and options configuration
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            builder.Services.AddAuthentication();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSession();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
