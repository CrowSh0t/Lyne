// Infrastructure/Services/FavoriteService.cs
using Application.Abstractions;
using Application.Contracts.Favorites;
using AutoMapper;
using Domains.Entities;

namespace Infrastructure.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public FavoriteService(
            IFavoriteRepository favoriteRepository,
            IProductRepository productRepository,
            IMapper mapper)
        {
            _favoriteRepository = favoriteRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserFavoriteDto>> GetUserFavoritesAsync(string userId)
        {
            var favorites = await _favoriteRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<UserFavoriteDto>>(favorites);
        }

        public async Task<UserFavoriteDto> AddToFavoritesAsync(string userId, int productId)
        {
            if (!await _productRepository.ExistsAsync(productId))
                throw new KeyNotFoundException($"Product with ID {productId} not found.");

            if (await _favoriteRepository.ExistsAsync(userId, productId))
                throw new InvalidOperationException("Product is already in favorites.");

            var favorite = new UserFavorite
            {
                UserId = userId,
                ProductId = productId
            };

            var created = await _favoriteRepository.AddAsync(favorite);
            // Reload with includes
            var withIncludes = await _favoriteRepository.GetAsync(userId, productId);
            return _mapper.Map<UserFavoriteDto>(withIncludes);
        }

        public async Task<bool> RemoveFromFavoritesAsync(string userId, int productId)
        {
            if (!await _favoriteRepository.ExistsAsync(userId, productId))
                throw new KeyNotFoundException("Product is not in favorites.");

            return await _favoriteRepository.RemoveAsync(userId, productId);
        }

        public async Task<bool> IsFavoriteAsync(string userId, int productId)
        {
            return await _favoriteRepository.ExistsAsync(userId, productId);
        }
    }
}
