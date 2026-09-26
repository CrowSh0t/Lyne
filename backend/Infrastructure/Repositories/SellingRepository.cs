using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Abstractions;

namespace Infrastructure.Repositories
{
    public class SellingRepository : ISellingRepository
    {
        private readonly ApplicationDbContext _context;

        public SellingRepository(ApplicationDbContext context) 
        {
            _context = context;
        }

        public async Task<IEnumerable<Selling>> GetAllAsync() 
        {
            return await _context.Sellings
                .Include(p => p.Product).ToListAsync();
                
        }
        public async Task<Selling> GetByIdAsync(int id)
        {
            return await _context.Sellings
                .Include(p => p.Product)
                .FirstOrDefaultAsync(p => p.id == id);
        }
        public async Task<Selling> CreateAsync(Selling selling) 
        {
            await _context.Sellings.AddAsync(selling);
            await _context.SaveChangesAsync();
            return selling;
        }
        public async Task<Selling> UpdateAsync(Selling selling) 
        {
            _context.Sellings.Update(selling);
            await _context.SaveChangesAsync();
            return selling;
        }
        public async Task<bool> DeleteAsync(int id) 
        {
            var selling = await _context.Sellings.FindAsync(id);

            if(selling == null) return false;

            _context.Sellings.Remove(selling);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Sellings.AnyAsync(p => p.id == id);
        }
    }
}
