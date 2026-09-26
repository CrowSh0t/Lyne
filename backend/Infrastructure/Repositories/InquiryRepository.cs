using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstractions;
using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class InquiryRepository : IInquiryRepository
    {
        private readonly ApplicationDbContext _context;

        public InquiryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SupportInquiry> AddAsync(SupportInquiry inquiry)
        {
            await _context.SupportInquiries.AddAsync(inquiry);
            await _context.SaveChangesAsync();
            return inquiry;
        }

        public async Task<SupportInquiry?> GetByIdAsync(int id)
        {
            return await _context.SupportInquiries.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<SupportInquiry>> GetAllAsync(InquiryStatus? status = null)
        {
            var query = _context.SupportInquiries.AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(x => x.Status == status.Value);
            }

            return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        }

        public async Task<IEnumerable<SupportInquiry>> GetByUserIdAsync(string userId)
        {
            return await _context.SupportInquiries
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task UpdateAsync(SupportInquiry inquiry)
        {
            inquiry.UpdatedAt = DateTime.UtcNow;
            _context.SupportInquiries.Update(inquiry);
            await _context.SaveChangesAsync();
        }
    }
}