// Application/Abstractions/IFavoriteRepository.cs
using Domains.Entities;

namespace Application.Abstractions
{
    public interface IFavoriteRepository
    {
        Task<IEnumerable<UserFavorite>> GetByUserIdAsync(string userId);
        Task<UserFavorite?> GetAsync(string userId, int productId);
        Task<UserFavorite> AddAsync(UserFavorite favorite);
        Task<bool> RemoveAsync(string userId, int productId);
        Task<bool> ExistsAsync(string userId, int productId);
    }
}
