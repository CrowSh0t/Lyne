// Infrastructure/Services/AuthService.cs
using Application.Abstractions;
using Application.Contracts.Auth;
using Domains.Entities;
using Infrastructure.Auth;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly JwtTokenFactory _jwtTokenFactory;

        public AuthService(UserManager<User> userManager, JwtTokenFactory jwtTokenFactory)
        {
            _userManager = userManager;
            _jwtTokenFactory = jwtTokenFactory;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Login);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password");

            var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!passwordValid)
                throw new UnauthorizedAccessException("Invalid email or password");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtTokenFactory.GenerateToken(user, roles.ToList());

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                UserName = user.UserName,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto registerDto)
        {
            var user = new User
            {
                Email = registerDto.Email,
                UserName = registerDto.Login ?? registerDto.Email,
                Country = registerDto.Country,              // ← Додай
                Name = registerDto.Login ?? registerDto.Email,  // ← Додай
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Registration failed: {errors}");
            }

            var token = _jwtTokenFactory.GenerateToken(user, new List<string>());

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                UserName = user.UserName,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
        }
    }
}