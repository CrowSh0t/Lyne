using Application.Contracts.Selling;
using Domains.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Abstractions
{
    public interface ISellingService
    {
        Task<IEnumerable<SellingDto>> GetAllSellingAsync();
        Task<SellingDto> GetSellingByIdAsync(int id);
        Task<SellingDto> CreateSellingAsync(CreateSellingDto createSellingDto);
        Task<SellingDto> UpdateSellingAsync(int id,UpdateSellingDto updateSellingDto);
        Task<bool> DeleteSellingAsync(int id);
    }
}
