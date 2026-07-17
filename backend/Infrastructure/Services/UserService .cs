// Infrastructure/Services/UserService.cs
using Application.Abstractions;
using Application.Contracts.Users;
using Domains.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Roles = roles.ToList(),
                    Avatar = user.Avatar,
                    Country = user.Country,
                    status = user.Status,
                });
            }

            return userDtos;
        }

        public async Task<UserDto> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found");

            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToList(),
                Avatar = user.Avatar,
                Country = user.Country,
                status = user.Status,
            };
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found");

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
        public async Task<UserDto> UpdateUserAsync(string id, UpdateUserProfileDto updateUserProfileDto) 
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) 
            {
                throw new KeyNotFoundException($"User with ID {id} not found");
            }
            user.Avatar = updateUserProfileDto.Avatar;
            user.Country = updateUserProfileDto.Country;
            user.Status = updateUserProfileDto.Status;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                throw new Exception("Failed to update user");
            }
            var roles = await _userManager.GetRolesAsync(user);
            return new UserDto()
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToList(),
                Avatar = user.Avatar,
                Country = user.Country,
                status = user.Status,
            };
            
        }
    }
}