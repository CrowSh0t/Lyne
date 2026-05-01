using Application.Abstractions;
using Application.Contracts.Auth;
using Domains.Entities;
using Infrastructure.Auth;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _cfg;
        private readonly JwtTokenFactory _jwt;
        private readonly IEmailSender _smtp;

        public AuthService(
            UserManager<User> userManager,
            JwtTokenFactory jwt,
            IConfiguration configuration,
            IEmailSender smtpEmailSender)
        {
            _userManager = userManager;
            _jwt = jwt;
            _cfg = configuration;
            _smtp = smtpEmailSender;
        }

        public async Task<(bool ok, string message)> RegisterAsync(RegisterRequestDto dto)
        {
            var user = new User
            {
                UserName = dto.Login,
                Email = dto.Email,
                Name = dto.Name,
                Dob = dto.Dob,
                Country = string.IsNullOrWhiteSpace(dto.Country) ? "UK" : dto.Country,
                Role = "User",
                // Одразу ставимо true, щоб не гратися з листами
                EmailConfirmed = true
            };

            var create = await _userManager.CreateAsync(user, dto.Password);
            if (!create.Succeeded)
                return (false, string.Join("; ", create.Errors.Select(e => e.Description)));

            // Логіку з генерацією токенів і відправкою листів для підтвердження видалено

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

            // Перевірку на IsEmailConfirmedAsync видалено

            var valid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!valid)
                return (false, "Invalid credentials.");

            var access = _jwt.CreateAccessToken(user);

            var isLocalhost = ip == "::1" || ip == "127.0.0.1";

            var accessCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment,
                SameSite = isDevelopment ? SameSiteMode.Lax : SameSiteMode.None,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddMinutes(_jwt.GetMin())
            };

            response.Cookies.Append("access_token", access, accessCookieOptions);

            return (true, "OK");
        }

        public Task LogoutAsync(string refreshToken)
        {
            // Тут просто чистимо куку, якщо треба
            throw new NotImplementedException();
        }
    }
}