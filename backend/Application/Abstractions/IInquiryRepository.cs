using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domains.Entities;

namespace Application.Abstractions
{
    public interface IInquiryRepository
    {
        Task<SupportInquiry> AddAsync(SupportInquiry inquiry);
        Task<SupportInquiry?> GetByIdAsync(int id);
        Task<IEnumerable<SupportInquiry>> GetAllAsync(InquiryStatus? status = null);
        Task<IEnumerable<SupportInquiry>> GetByUserIdAsync(string userId);
        Task UpdateAsync(SupportInquiry inquiry);
    }
}