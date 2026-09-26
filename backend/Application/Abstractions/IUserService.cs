// Application/Abstractions/IUserService.cs
using Application.Contracts.Users;

namespace Application.Abstractions
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(string id);
        Task<bool> DeleteUserAsync(string id);
        Task<UserDto> UpdateUserAsync(string id, UpdateUserProfileDto updateUserProfileDto);
    }
}