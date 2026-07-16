using Application.Abstractions;
using Application.Contracts.Selling;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domains.Entities;

namespace Infrastructure.Services
{
    public class SellingService : ISellingService
    {
        private readonly ISellingRepository _sellingRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public SellingService(
            ISellingRepository sellingRepository,
            IProductRepository productRepository,
            IMapper mapper)
        {
            _sellingRepository = sellingRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }
        public async Task<SellingDto> CreateSellingAsync(CreateSellingDto createSellingDto)
        {
            if (!await _productRepository.ExistsAsync(createSellingDto.ProductId)) 
            {
                throw new KeyNotFoundException("Product not found.");
            }
            if (createSellingDto.StartSelling >= createSellingDto.EndSelling) 
            {
                throw new ArgumentException("StartSelling must be earlier than EndSelling.");
            }

            var selling = _mapper.Map<Selling>(createSellingDto);
            var createdSelling = await _sellingRepository.CreateAsync(selling);
            return _mapper.Map<SellingDto>(createdSelling);

        }

        public async Task<bool> DeleteSellingAsync(int id)
        {
            

            if (!await _sellingRepository.ExistsAsync(id)) 
            {
                throw new KeyNotFoundException($"Selling ID {id} not found ");
            }

            return await _sellingRepository.DeleteAsync(id);

        }

        public async Task<IEnumerable<SellingDto>> GetAllSellingAsync()
        {
            var selling = await _sellingRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SellingDto>>(selling);
        }

        public async Task<SellingDto> GetSellingByIdAsync(int id)
        {
            var selling = await _sellingRepository.GetByIdAsync(id);

            if(selling == null)
            {
                throw new KeyNotFoundException($"Selling with ID {id} not found.");
            }
            return _mapper.Map<SellingDto>(selling);
        }

        public async Task<SellingDto> UpdateSellingAsync(int id, UpdateSellingDto updateSellingDto)
        {
            if (!await _sellingRepository.ExistsAsync(id)) 
            {
                throw new KeyNotFoundException($"Selling with ID {id} not found.");
            }
            if (!await _productRepository.ExistsAsync(updateSellingDto.ProductId)) 
            {
                throw new KeyNotFoundException($"Product with ID {id} not found.");
            }
            if (updateSellingDto.StartSelling >= updateSellingDto.EndSelling)
            {
                throw new ArgumentException("StartSelling must be earlier than EndSelling.");
            }

            var exsistingSelling = await _sellingRepository.GetByIdAsync(id);
            _mapper.Map<UpdateSellingDto,Selling>(updateSellingDto, exsistingSelling);
            await _sellingRepository.UpdateAsync(exsistingSelling);
            return _mapper.Map<SellingDto>(exsistingSelling);
        }

    }
}
