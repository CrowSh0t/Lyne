// Application/Abstractions/IFavoriteService.cs
using Application.Contracts.Favorites;

namespace Application.Abstractions
{
    public interface IFavoriteService
    {
        Task<IEnumerable<UserFavoriteDto>> GetUserFavoritesAsync(string userId);
        Task<UserFavoriteDto> AddToFavoritesAsync(string userId, int productId);
        Task<bool> RemoveFromFavoritesAsync(string userId, int productId);
        Task<bool> IsFavoriteAsync(string userId, int productId);
    }
}
