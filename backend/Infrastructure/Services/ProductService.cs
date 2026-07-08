using Application.Abstractions;
using Application.Contracts.Products;
using AutoMapper;
using Domains.Entities;
using Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            var product = _mapper.Map<Products>(createProductDto);
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
    }
}
