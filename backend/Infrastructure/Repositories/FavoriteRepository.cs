// Infrastructure/Repositories/FavoriteRepository.cs
using Application.Abstractions;
using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly ApplicationDbContext _context;

        public FavoriteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserFavorite>> GetByUserIdAsync(string userId)
        {
            return await _context.UserFavorites
                .Include(f => f.Product)
                    .ThenInclude(p => p.Color)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Size)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Brand)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Discounts)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<UserFavorite?> GetAsync(string userId, int productId)
        {
            return await _context.UserFavorites
                .Include(f => f.Product)
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);
        }

        public async Task<UserFavorite> AddAsync(UserFavorite favorite)
        {
            await _context.UserFavorites.AddAsync(favorite);
            await _context.SaveChangesAsync();
            return favorite;
        }

        public async Task<bool> RemoveAsync(string userId, int productId)
        {
            var favorite = await _context.UserFavorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);

            if (favorite == null) return false;

            _context.UserFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(string userId, int productId)
        {
            return await _context.UserFavorites
                .AnyAsync(f => f.UserId == userId && f.ProductId == productId);
        }
    }
}
