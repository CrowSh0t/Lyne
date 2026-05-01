using Application.Abstractions;
using Application.Contracts.Auth;
using Infrastructure.Auth;
using Infrastructure.Identity;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text;

namespace RWA.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IAuthService _auth;
        private readonly RefreshOptions _refreshOpt;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _cfg;
        private readonly iEmailSender _smtp;

        public AuthController(IAuthService auth, IOptions<RefreshOptions> refreshOpt, IWebHostEnvironment env, UserManager<User> userManager, IConfiguration cfg, iEmailSender smtp)
        {
            _auth = auth;
            _refreshOpt = refreshOpt.Value;
            _env = env;
            _userManager = userManager;
            _cfg = cfg;
            _smtp = smtp;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            var (ok, message) = await _auth.RegisterAsync(dto);

            if (!ok)
                return BadRequest(new { message });

            return Ok(new { message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var isDev = _env.IsDevelopment();

            var (ok, msg) = await _auth.LoginAsync(dto, ip, Response, isDev);

            if (!ok) return BadRequest(new { message = msg });

            return Ok(new { message = "OK" }); // токенів нема в body
        }

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto dto)
        {
            var email = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Email));
            var token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return BadRequest(new { message = "User not found" });

            var res = await _userManager.ConfirmEmailAsync(user, token);
            if (!res.Succeeded) return BadRequest(new { message = "Invalid token" });

            return Ok(new { message = "Email confirmed" });
        }

        public record ConfirmEmailDto(string Email, string Token);

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Ok(new { message = "If email exists, link was sent." });

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return Ok(new { message = "If email exists, link was sent." });

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var email = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(dto.Email));

            var url = $"{_cfg["App:FrontendBaseUrl"]}/reset-password?email={email}&token={token}";

            await _smtp.SendAsync(dto.Email, "Reset password",
                $"<p>Reset password:</p><p><a href=\"{url}\">Reset</a></p>");

            return Ok(new { message = "If email exists, link was sent." });
        }

        public record ForgotPasswordDto(string Email);

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var email = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Email));
            var token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return BadRequest(new { message = "Invalid request" });

            var res = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
            if (!res.Succeeded)
                return BadRequest(new { message = string.Join("; ", res.Errors.Select(e => e.Description)) });

            return Ok(new { message = "Password reset OK" });
        }

        public record ResetPasswordDto(string Email, string Token, string NewPassword);



        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refresh_token"] ??
                               Request.Headers["X-Refresh-Token"].FirstOrDefault();

            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "No refresh token" });

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var result = await _auth.RefreshAsync(refreshToken, ip);

            if (!result.ok)
                return Unauthorized(new { message = result.message });

            var isLocalhost = Request.Host.Host.Contains("localhost");

            // Встановлюємо access_token як HttpOnly cookie
            Response.Cookies.Append("access_token", result.accessToken!, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,                     // false для localhost, true для production
                SameSite = isLocalhost ? SameSiteMode.Lax : SameSiteMode.None,
                Path = "/",
                MaxAge = TimeSpan.FromMinutes(15)
            });

            // Якщо refresh_token оновлюється, теж встановлюємо
            if (!string.IsNullOrEmpty(result.refreshToken))
            {
                Response.Cookies.Append("refresh_token", result.refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = isLocalhost ? SameSiteMode.Lax : SameSiteMode.None,
                    Path = "/api/auth",
                    MaxAge = TimeSpan.FromDays(7)
                });
            }

            return Ok(new
            {
                accessToken = result.accessToken,
                refreshToken = result.refreshToken
            });
        }


    }
}
