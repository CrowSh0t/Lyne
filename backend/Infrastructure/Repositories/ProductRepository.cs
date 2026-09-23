// Infrastructure/Repositories/ProductRepository.cs
using Application.Abstractions;
using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Products>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Categories)
                .ToListAsync();
        }

        public async Task<Products> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Categories)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<IEnumerable<Products>> GetProductsByIdsAsync(List<int> productIds)
        {
            return await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();
        }
        public async Task<Products> AddAsync(Products product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Products> UpdateAsync(Products product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Products>> GetByCategoryIdAsync(int categoryId)
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Categories)
                .Where(p => p.Categories.Any(c => c.Id == categoryId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Products>> GetByBrandIdAsync(int brandId)
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Categories)
                .Where(p => p.BrandId == brandId)
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Products.AnyAsync(p => p.Id == id);
        }

        public async Task<bool> ProductCodeExistsAsync(string productCode)
        {
            return await _context.Products
                .AnyAsync(i => i.ProductCode == productCode);
        }

        public async Task<IEnumerable<Products>> GetSuggestedMatchesAsync(int productId, int excludeCategoryId, int take)
        {
            var source = await _context.Products
        .AsNoTracking()
        .Include(p => p.Categories)
        .FirstOrDefaultAsync(p => p.Id == productId);

            if (source == null)
                return Enumerable.Empty<Products>();

            var sourceCategoryIds = source.Categories.Select(c => c.Id).ToHashSet();

            var candidates = _context.Products
                .AsNoTracking()
                .Include(p => p.Brand)
                .Include(p => p.Color)
                .Include(p => p.Categories)
                .Where(p => p.Id != productId);

            if (excludeCategoryId > 0)
            {
                candidates = candidates.Where(p => !p.Categories.Any(c => c.Id == excludeCategoryId));
            }

            var candidateList = await candidates.ToListAsync();

            var scored = candidateList
                .Select(p => new
                {
                    Product = p,
                    Score = (p.BrandId == source.BrandId ? 2 : 0)
                          + (p.ColorId == source.ColorId ? 2 : 0)
                          + (p.Categories.Any(c => sourceCategoryIds.Contains(c.Id)) ? 1 : 0)
                })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .ThenByDescending(x => x.Product.Id)
                .Take(take)
                .Select(x => x.Product);

            return scored.ToList();
        }
    }
}