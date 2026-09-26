using Application.Abstractions;
using Application.Contracts.Inquiries;
using Application.Contracts.Inquiry;
using AutoMapper;
using Domains.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class InquiryService : IInquiryService
    {
        private readonly IInquiryRepository _repository;
        private readonly IMapper _mapper;

        public InquiryService(IInquiryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<InquiryDto> CreateInquiryAsync(
            CreateInquiryDto dto,
            string? userId,
            string? userEmail,
            string? userName)
        {
            var inquiry = _mapper.Map<SupportInquiry>(dto);

            inquiry.UserId = userId;
            if (!string.IsNullOrEmpty(userEmail)) inquiry.Email = userEmail;
            if (!string.IsNullOrEmpty(userName)) inquiry.Name = userName;

            var created = await _repository.AddAsync(inquiry);
            return _mapper.Map<InquiryDto>(created);
        }

        public async Task<IEnumerable<InquiryDto>> GetUserInquiriesAsync(string userId)
        {
            var items = await _repository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<InquiryDto>>(items);
        }

        public async Task<IEnumerable<InquiryDto>> GetAllInquiriesAsync(InquiryStatus? status = null)
        {
            var items = await _repository.GetAllAsync(status);
            return _mapper.Map<IEnumerable<InquiryDto>>(items);
        }

        public async Task<InquiryDto> GetByIdAsync(int id)
        {
            var inquiry = await _repository.GetByIdAsync(id);
            if (inquiry == null)
            {
                throw new KeyNotFoundException($"Inquiry with id {id} not found.");
            }

            return _mapper.Map<InquiryDto>(inquiry);
        }

        public async Task<InquiryDto> UpdateStatusAsync(int id, UpdateInquiryStatusDto dto)
        {
            var inquiry = await _repository.GetByIdAsync(id);
            if (inquiry == null)
            {
                throw new KeyNotFoundException($"Inquiry with id {id} not found.");
            }

            inquiry.Status = (InquiryStatus)dto.Status;
            if (dto.AdminNote != null)
            {
                inquiry.AdminNote = dto.AdminNote;
            }

            await _repository.UpdateAsync(inquiry);
            return _mapper.Map<InquiryDto>(inquiry);
        }
    }
}
