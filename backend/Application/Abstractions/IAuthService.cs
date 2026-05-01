using Application.Contracts.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Abstractions
{
    public interface IAuthService
    {
        Task<(bool ok, string message)> RegisterAsync(RegisterRequestDto dto);
        Task<(bool ok, string message)> LoginAsync(
            LoginRequestDto dto,
            string? ip,
            HttpResponse response,
            bool isDevelopment);
        Task LogoutAsync(string refreshToken);
    }
}
