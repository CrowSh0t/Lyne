using Application.Abstractions;
using Application.Contracts.Products;
using AutoMapper;
using Domains.Entities;

namespace Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException($"Product with ID {id} not found");

            return _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            string productCode;

            do
            {
                productCode = GenerateProductCode();
            }
            while (await _productRepository.ProductCodeExistsAsync(productCode));

            var product = _mapper.Map<Products>(createProductDto);
            product.ProductCode = productCode;
            product.IsFavorite = false;

            var createdProduct = await _productRepository.AddAsync(product);
            return _mapper.Map<ProductDto>(createdProduct);
        }

        public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
                throw new KeyNotFoundException($"Product with ID {id} not found");

            _mapper.Map(updateProductDto, existingProduct);
            var updatedProduct = await _productRepository.UpdateAsync(existingProduct);
            return _mapper.Map<ProductDto>(updatedProduct);
        }

        public async Task<ProductDto> SetFavoriteAsync(int id, bool isFavorite)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
                throw new KeyNotFoundException($"Product with ID {id} not found");

            existingProduct.IsFavorite = isFavorite;

            var updatedProduct = await _productRepository.UpdateAsync(existingProduct);
            return _mapper.Map<ProductDto>(updatedProduct);
        }

        

        public async Task<bool> DeleteProductAsync(int id)
        {
            if (!await _productRepository.ExistsAsync(id))
                throw new KeyNotFoundException($"Product with ID {id} not found");

            return await _productRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _productRepository.GetByCategoryIdAsync(categoryId);
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByBrandAsync(int brandId)
        {
            var products = await _productRepository.GetByBrandIdAsync(brandId);
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        private static string GenerateProductCode()
        {
            return Guid.NewGuid().ToString("N")[..10].ToUpper();
        }

        public async Task<IEnumerable<ProductDto>> GetCompleteTheLookAsync(int id, int take = 4)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException($"Product with ID {id} not found");

            if (product.MatchProductsId != null && product.MatchProductsId.Any())
            {
                var manualMatches = await _productRepository.GetProductsByIdsAsync(product.MatchProductsId);
                var manualList = manualMatches.Where(p => p.Id != id).Take(take).ToList();
                if (manualList.Any())
                    return _mapper.Map<IEnumerable<ProductDto>>(manualList);
            }

            var primaryCategoryId = product.CategoriesId?.FirstOrDefault() ?? 0;
            var suggested = await _productRepository.GetSuggestedMatchesAsync(id, primaryCategoryId, take);
            return _mapper.Map<IEnumerable<ProductDto>>(suggested);
        }
    }
}