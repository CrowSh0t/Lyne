using Domains.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Application.Abstractions
{
    public interface ISellingRepository
    {
        Task<IEnumerable<Selling>> GetAllAsync();
        Task<Selling> GetByIdAsync(int id);
        Task<Selling> CreateAsync(Selling selling);
        Task<Selling> UpdateAsync(Selling selling);
        Task<bool> ExistsAsync(int id);
        Task<bool> DeleteAsync(int id);
    }
}
