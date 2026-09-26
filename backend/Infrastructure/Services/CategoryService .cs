// Infrastructure/Services/CategoryService.cs
using Application.Abstractions;
using Application.Contracts.Categorys;
using AutoMapper;
using Domains.Entities;
using Infrastructure.Repositories;

namespace Infrastructure.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IProductRepository _productRepository;

        public CategoryService(ICategoryRepository categoryRepository, IProductRepository productRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<CategoryDto> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                throw new KeyNotFoundException($"Category with ID {id} not found");

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            

            if (createCategoryDto.ParentCategoryId != null)
            {
                var parent = await _categoryRepository
                    .GetByIdAsync(createCategoryDto.ParentCategoryId.Value);

                if (parent == null)
                    throw new KeyNotFoundException("Parent category not found");
            }
          
            var category = _mapper.Map<Category>(createCategoryDto);
            
            if (createCategoryDto.ProductsId?.Any() == true)
            {
                var products = await _productRepository
                    .GetProductsByIdsAsync(createCategoryDto.ProductsId);

                if (products.Any())
                {
                    category.Products = products.ToList();
                }
            }

            var createdCategory = await _categoryRepository.AddAsync(category);
            return _mapper.Map<CategoryDto>(createdCategory);
        }

        public async Task<CategoryDto> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto)
        {
            if (updateCategoryDto.ParentCategoryID == id)
            {
                throw new ArgumentException("Category cannot be its own parent.");
            }
            var existingCategory = await _categoryRepository.GetByIdAsync(id);
            if (existingCategory == null)
                throw new KeyNotFoundException($"Category with ID {id} not found");

            _mapper.Map(updateCategoryDto, existingCategory);
            var updatedCategory = await _categoryRepository.UpdateAsync(existingCategory);
            return _mapper.Map<CategoryDto>(updatedCategory);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            if (!await _categoryRepository.ExistsAsync(id))
                throw new KeyNotFoundException($"Category with ID {id} not found");

            return await _categoryRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoriesByIdsAsync(List<int> categoryIds)
        {
            var categories = await _categoryRepository.GetCategoriesByIdsAsync(categoryIds);
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<CategoryDto> UpdateImageUrlCategoryAsync(int id, string ImageUrl)
        {
            var existingCategory = await _categoryRepository.GetByIdAsync(id);
            if (existingCategory == null)
                throw new KeyNotFoundException($"Category with ID {id} not found");

            existingCategory.ImageUrl = ImageUrl;
            var updatedImageUrl = await _categoryRepository.UpdateAsync(existingCategory);

            return _mapper.Map<CategoryDto>(updatedImageUrl);
        }

        public async Task<IEnumerable<CategoryDto>> GetAllParentsCategoriesAsync()
        {
            
            var categories = await _categoryRepository.GetAllAsync();
            var parentsCategory = categories
                .Select(i => i.ParentCategory);
            return _mapper.Map<IEnumerable<CategoryDto>>(parentsCategory);
        }
    }
}