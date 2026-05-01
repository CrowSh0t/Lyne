using Application.Abstractions;
using Application.Contracts.Auth;
using Domains.Entities;
using Domains.Entities;
using Infrastructure.Auth;
using Infrastructure.Identity;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _cfg;
        private readonly ApplicationDbContext _db;
        private readonly JwtTokenFactory _jwt;
        private readonly IEmailSender _smtp;
        private readonly RefreshOptions _refreshOpt;

        public AuthService(
            UserManager<User> userManager,
            JwtTokenFactory jwt,
            ApplicationDbContext db,
            IOptions<RefreshOptions> refreshOpt,
            IConfiguration configuration,
            IEmailSender smtpEmailSender)
        {
            _userManager = userManager;
            _db = db;
            _jwt = jwt;
            _refreshOpt = refreshOpt.Value;
            _cfg = configuration;
            _smtp = smtpEmailSender;
        }

        public async Task<(bool ok, string message)> RegisterAsync(RegisterRequestDto dto)
        {
            // Якщо у DTO все ще є ConfirmPassword, залишаємо цю перевірку. 
            // Якщо ні — рядок можна видалити.
            // if (dto.Password != dto.ConfirmPassword)
            //    return (false, "Passwords do not match.");

            // Створюємо користувача одразу з усіма необхідними даними
            var user = new User
            {
                UserName = dto.Login, // або dto.Email, залежно від того, що ви використовуєте як логін при реєстрації
                Email = dto.Email,
                Name = dto.Name,
                Dob = dto.Dob,
                Country = string.IsNullOrWhiteSpace(dto.Country) ? "UK" : dto.Country,
                Role = "User", // Дефолтна роль, якщо використовуєте це поле
                EmailConfirmed = false
            };

            var create = await _userManager.CreateAsync(user, dto.Password);
            if (!create.Succeeded)
                return (false, string.Join("; ", create.Errors.Select(e => e.Description)));

            // Генерація токена підтвердження пошти
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(System.Text.Encoding.UTF8.GetBytes(token));

            var email = WebEncoders.Base64UrlEncode(System.Text.Encoding.UTF8.GetBytes(user.Email!));

            var url = $"{_cfg["App:FrontendBaseUrl"]}/confirm-email?email={email}&token={token}";

            await _smtp.SendAsync(user.Email!, "Confirm your email",
                $"<p>Confirm email:</p><p><a href=\"{url}\">Confirm</a></p>");

            // Більше не створюємо UserProfile, всі дані вже в Identity User

            return (true, "Account created!");
        }

        public async Task<(bool ok, string message)> LoginAsync(
            LoginRequestDto dto,
            string? ip,
            HttpResponse response,
            bool isDevelopment)
        {
            if (string.IsNullOrWhiteSpace(dto.Login) || string.IsNullOrWhiteSpace(dto.Password))
                return (false, "Login and password are required.");

            var login = dto.Login.Trim();

            User? user = login.Contains("@")
                ? await _userManager.FindByEmailAsync(login)
                : await _userManager.FindByNameAsync(login);

            if (user == null)
                return (false, "User not found.");

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return (false, "Confirm your email first.");

            var valid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!valid)
                return (false, "Invalid credentials.");

            // 1) Access token
            var access = _jwt.CreateAccessToken(user);

            // 2) Refresh token (store hash in DB)
            var refresh = TokenUtils.GenerateRefreshToken();
            var hash = TokenUtils.Sha256Hex(refresh);

            var session = new RefreshSession
            {
                UserId = user.Id,
                TokenHash = hash,
                Ip = ip,
                DeviceId = null, // Якщо в LoginRequestDto немає DeviceId, залишаємо null
                ExpiresAtUtc = DateTime.UtcNow.AddDays(_refreshOpt.ExpDays)
            };

            _db.RefreshSessions.Add(session);
            await _db.SaveChangesAsync();

            var accessCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment,     // Залежить від середовища (DEV/PROD)
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddMinutes(_jwt.GetMin()) // переконайтесь, що GetMin() повертає правильне значення
            };

            var refreshCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(_refreshOpt.ExpDays)
            };

            response.Cookies.Append("access_token", access, accessCookieOptions);
            response.Cookies.Append("refresh_token", refresh, refreshCookieOptions);

            return (true, "OK");
        }

        public async Task<(bool ok, string? accessToken, string? refreshToken, string message)> RefreshAsync(
            string refreshToken, string? ip)
        {
            var hash = TokenUtils.Sha256Hex(refreshToken);

            var session = await _db.RefreshSessions
                .AsTracking()
                .FirstOrDefaultAsync(x => x.TokenHash == hash);

            if (session == null)
                return (false, null, null, "Invalid refresh token");

            // Якщо вже відкликаний — хтось намагається використати старий токен
            if (session.RevokedAtUtc != null)
            {
                await RevokeAllUserSessions(session.UserId);
                return (false, null, null, "Refresh token reuse detected");
            }

            if (session.ExpiresAtUtc <= DateTime.UtcNow)
            {
                session.RevokedAtUtc = DateTime.UtcNow;
                await _db.SaveChangesAsync();
                return (false, null, null, "Refresh token expired");
            }

            // Отримуємо користувача
            var user = await _userManager.FindByIdAsync(session.UserId);
            if (user == null)
                return (false, null, null, "User not found");

            // Генеруємо нову пару
            var newRefresh = TokenUtils.GenerateRefreshToken();
            var newHash = TokenUtils.Sha256Hex(newRefresh);
            var newAccess = _jwt.CreateAccessToken(user);

            // Відкликаємо стару сесію
            session.RevokedAtUtc = DateTime.UtcNow;
            session.ReplacedByTokenHash = newHash;

            // Створюємо нову сесію
            _db.RefreshSessions.Add(new RefreshSession
            {
                UserId = session.UserId,
                TokenHash = newHash,
                Ip = ip,
                DeviceId = session.DeviceId,
                ExpiresAtUtc = DateTime.UtcNow.AddDays(_refreshOpt.ExpDays) // Використовуємо налаштування замість хардкоду (7)
            });

            await _db.SaveChangesAsync();

            return (true, newAccess, newRefresh, "OK");
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var hash = TokenUtils.Sha256Hex(refreshToken);
            var session = await _db.RefreshSessions.AsTracking().FirstOrDefaultAsync(x => x.TokenHash == hash);
            if (session == null) return;

            if (session.RevokedAtUtc == null)
            {
                session.RevokedAtUtc = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
        }

        private async Task RevokeAllUserSessions(string userId)
        {
            var sessions = await _db.RefreshSessions
                .Where(x => x.UserId == userId && x.RevokedAtUtc == null)
                .ToListAsync();

            var now = DateTime.UtcNow;
            foreach (var s in sessions)
            {
                s.RevokedAtUtc = now;
            }

            await _db.SaveChangesAsync();
        }
    }
}