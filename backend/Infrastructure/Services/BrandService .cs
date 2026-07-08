// Infrastructure/Services/BrandService.cs
using Application.Abstractions;
using Application.Contracts.Brands;
using AutoMapper;
using Domains.Entities;

namespace Infrastructure.Services
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IMapper _mapper;

        public BrandService(IBrandRepository brandRepository, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BrandDto>> GetAllBrandsAsync()
        {
            var brands = await _brandRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<BrandDto>>(brands);
        }

        public async Task<BrandDto> GetBrandByIdAsync(int id)
        {
            var brand = await _brandRepository.GetByIdAsync(id);
            if (brand == null)
                throw new KeyNotFoundException($"Brand with ID {id} not found");

            return _mapper.Map<BrandDto>(brand);
        }

        public async Task<BrandDto> CreateBrandAsync(CreateBrandDto createBrandDto)
        {
            var brand = _mapper.Map<Brand>(createBrandDto);
            var createdBrand = await _brandRepository.AddAsync(brand);
            return _mapper.Map<BrandDto>(createdBrand);
        }

        public async Task<BrandDto> UpdateBrandAsync(int id, UpdateBrandDto updateBrandDto)
        {
            var existingBrand = await _brandRepository.GetByIdAsync(id);
            if (existingBrand == null)
                throw new KeyNotFoundException($"Brand with ID {id} not found");

            _mapper.Map(updateBrandDto, existingBrand);
            var updatedBrand = await _brandRepository.UpdateAsync(existingBrand);
            return _mapper.Map<BrandDto>(updatedBrand);
        }

        public async Task<bool> DeleteBrandAsync(int id)
        {
            if (!await _brandRepository.ExistsAsync(id))
                throw new KeyNotFoundException($"Brand with ID {id} not found");

            return await _brandRepository.DeleteAsync(id);
        }
    }
}