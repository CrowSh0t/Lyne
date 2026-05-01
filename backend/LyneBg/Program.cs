using Application.Abstractions;
using Domains.Entities;
using Infrastructure.Auth;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. РЕЄСТРУЄМО CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()    // Дозволяє запити з будь-яких адрес (localhost:3000, 5173 тощо)
              .AllowAnyHeader()    // Дозволяє будь-які заголовки (Content-Type, Authorization)
              .AllowAnyMethod();   // Дозволяє будь-які методи (GET, POST, PUT, DELETE)
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
// 1. Налаштовуємо Identity
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    // Тут можна налаштувати складність пароля (за бажанням)
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>() // Кажемо Identity використовувати твою базу
.AddDefaultTokenProviders(); // Потрібно для генерації токенів підтвердження пошти/скидання пароля

// 2. Твій сервіс (який ти вже додав раніше)
builder.Services.AddScoped<IAuthService, AuthService>();

// Додаємо цей рядок (переконайся, що імпортував потрібні namespace)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<JwtTokenFactory>();
builder.Services.AddScoped<IEmailSender, EmailSender>(); // Якщо використовуєш пошту

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. ВМИКАЄМО CORS (Важливо: має бути перед UseAuthorization!)
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();