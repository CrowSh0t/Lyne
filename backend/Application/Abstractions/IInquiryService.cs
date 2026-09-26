using Application.Contracts.Inquiries;
using Application.Contracts.Inquiry;
using Domains.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Abstractions
{
    public interface IInquiryService
    {
        Task<InquiryDto> CreateInquiryAsync(CreateInquiryDto dto, string? userId, string? userEmail, string? userName);
        Task<IEnumerable<InquiryDto>> GetUserInquiriesAsync(string userId);
        Task<IEnumerable<InquiryDto>> GetAllInquiriesAsync(InquiryStatus? status = null);
        Task<InquiryDto> GetByIdAsync(int id);
        Task<InquiryDto> UpdateStatusAsync(int id, UpdateInquiryStatusDto dto);
    }
}