using Application.Abstractions;
using Application.Contracts.Products;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LyneBg.Controllers.Products
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;
        private readonly ApplicationDbContext _context;

        public ProductsController(
            IProductService productService,
            ILogger<ProductsController> logger,
            ApplicationDbContext context)
        {
            _productService = productService;
            _logger = logger;
            _context = context;
        }

        // ===== БАЗОВІ CRUD МЕТОДИ =====

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                return Ok(product);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting product with id {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductDto createProductDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdProduct = await _productService.CreateProductAsync(createProductDto);
                return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> Update(int id, [FromBody] UpdateProductDto updateProductDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedProduct = await _productService.UpdateProductAsync(id, updateProductDto);
                return Ok(updatedProduct);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating product with id {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _productService.DeleteProductAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting product with id {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetByCategory(int categoryId)
        {
            try
            {
                var products = await _productService.GetProductsByCategoryAsync(categoryId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting products by category {categoryId}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("brand/{brandId}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetByBrand(int brandId)
        {
            try
            {
                var products = await _productService.GetProductsByBrandAsync(brandId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting products by brand {brandId}");
                return StatusCode(500, "Internal server error");
            }
        }

        // ===== МЕТОДИ СТАТИСТИКИ =====

        /// <summary>
        /// Отримати всі продукти згруповані по назві
        /// </summary>
        [HttpGet("stats/all-grouped")]
        public async Task<ActionResult> GetAllGrouped()
        {
            try
            {
                // Спочатку отримуємо всі продукти з бази
                var products = await _context.Products.ToListAsync();

                // Групуємо в пам'яті
                var grouped = products
                    .GroupBy(p => p.Name)
                    .Select(g => new
                    {
                        Name = g.Key,
                        TotalCount = g.Count(),
                        AvailableColors = g.Select(p => p.Color.ToString()).Distinct().ToList(),
                        AvailableSizes = g.Select(p => p.Size.ToString()).Distinct().ToList(),
                        PriceMin = g.Min(p => p.Price),
                        PriceMax = g.Max(p => p.Price)
                    })
                    .ToList();

                return Ok(grouped);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting grouped products");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Отримати інформацію по конкретному продукту за назвою
        /// </summary>
        [HttpGet("stats/by-name")]
        public async Task<ActionResult> GetProductInfoByName([FromQuery] string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                    return BadRequest("Параметр name обов'язковий");

                var products = await _context.Products
                    .Where(p => p.Name.ToLower() == name.ToLower())
                    .ToListAsync();

                if (!products.Any())
                    return NotFound($"Продукт '{name}' не знайдено");

                var result = new
                {
                    Name = name,
                    TotalCount = products.Count,
                    AvailableColors = products
                        .Select(p => p.Color.ToString())
                        .Distinct()
                        .ToList(),
                    AvailableSizes = products
                        .Select(p => p.Size.ToString())
                        .Distinct()
                        .ToList(),
                    PriceRange = new
                    {
                        Min = products.Min(p => p.Price),
                        Max = products.Max(p => p.Price)
                    },
                    Variants = products
                        .GroupBy(p => new { p.Size, p.Color })
                        .Select(g => new
                        {
                            Size = g.Key.Size.ToString(),
                            Color = g.Key.Color.ToString(),
                            Count = g.Count(),
                            Prices = g.Select(p => p.Price).ToList()
                        })
                        .ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting product info for '{name}'");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Отримати загальну кількість всіх продуктів
        /// </summary>
        [HttpGet("stats/total-count")]
        public async Task<ActionResult> GetTotalCount()
        {
            try
            {
                var count = await _context.Products.CountAsync();
                return Ok(new { TotalProducts = count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total count");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}