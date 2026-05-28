// Application/Abstractions/IBrandService.cs
using Application.Contracts.Brands;

namespace Application.Abstractions
{
    public interface IBrandService
    {
        Task<IEnumerable<BrandDto>> GetAllBrandsAsync();
        Task<BrandDto> GetBrandByIdAsync(int id);
        Task<BrandDto> CreateBrandAsync(CreateBrandDto createBrandDto);
        Task<BrandDto> UpdateBrandAsync(int id, UpdateBrandDto updateBrandDto);
        Task<bool> DeleteBrandAsync(int id);
    }
}