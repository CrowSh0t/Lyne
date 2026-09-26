using Domains.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Abstractions
{
    public interface IProductRepository
    {
        Task<IEnumerable<Products>> GetAllAsync();
        Task<Products> GetByIdAsync(int id);
        Task<Products> AddAsync(Products product);
        Task<Products> UpdateAsync(Products product);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Products>> GetByCategoryIdAsync(int categoryId);
        Task<IEnumerable<Products>> GetByBrandIdAsync(int brandId);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Products>> GetProductsByIdsAsync(List<int> productIds);
        Task<bool> ProductCodeExistsAsync(string productCode);
        Task<IEnumerable<Products>> GetSuggestedMatchesAsync(int productId, int excludeCategoryId, int take);

    }
}
