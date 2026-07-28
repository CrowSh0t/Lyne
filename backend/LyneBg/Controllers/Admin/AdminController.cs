// LyneBg/Controllers/AdminController.cs
using Application.Contracts.Brands;
using Application.Contracts.Categorys;
using Application.Contracts.Color;
using Application.Contracts.Discount;
using Application.Contracts.Products;
using Application.Contracts.Size;
using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LyneBg.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AdminController> _logger;
        private readonly UserManager<User> _userManager;        // ← Додай
        private readonly RoleManager<IdentityRole> _roleManager; // ← Додай

        public AdminController(
            ApplicationDbContext context,
            ILogger<AdminController> logger,
            UserManager<User> userManager,        // ← Додай
            RoleManager<IdentityRole> roleManager) // ← Додай
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public class CreateAdminDto
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
            public string? UserName { get; set; }
            public string? Name { get; set; }
            public string? Country { get; set; }
            public string? PhoneNumber { get; set; }
        }

        [HttpPost("admins")]
        public async Task<ActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
        {
            var user = new User
            {
                Email = dto.Email,
                UserName = dto.UserName ?? dto.Email,
                Name = dto.Name ?? dto.Email,
                Country = dto.Country ?? "Ukraine",
                EmailConfirmed = true,
                PhoneNumber = dto.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { message = errors });
            }

            // Додаємо роль Admin
            if (!await _roleManager.RoleExistsAsync("Admin"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            await _userManager.AddToRoleAsync(user, "Admin");

            return Ok(new
            {
                message = $"Admin {user.Email} created successfully",
                userId = user.Id,
                email = user.Email
            });
        }

        [HttpPut("users/{userId}/make-admin")]
        public async Task<ActionResult> MakeAdmin(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (!await _roleManager.RoleExistsAsync("Admin"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            if (await _userManager.IsInRoleAsync(user, "Admin"))
                return Ok(new { message = $"User {user.Email} is already admin" });

            var result = await _userManager.AddToRoleAsync(user, "Admin");
            if (result.Succeeded)
                return Ok(new { message = $"User {user.Email} is now admin" });

            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        [HttpPut("users/{userId}/remove-admin")]
        public async Task<ActionResult> RemoveAdmin(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            var result = await _userManager.RemoveFromRoleAsync(user, "Admin");
            if (result.Succeeded)
                return Ok(new { message = $"Admin role removed from {user.Email}" });

            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        [HttpGet("admins")]
        public async Task<ActionResult> GetAllAdmins()
        {
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            var result = admins.Select(u => new
            {
                u.Id,
                u.Email,
                u.UserName,
                u.PhoneNumber
            });
            return Ok(result);
        }



        [HttpGet("dashboard")]
        public async Task<ActionResult> GetDashboard()
        {
            var stats = new
            {
                TotalUsers = await _context.Users.CountAsync(),
                TotalProducts = await _context.Products.CountAsync(),
                TotalOrders = await _context.Orders.CountAsync(),
                TotalCategories = await _context.Categories.CountAsync(),
                TotalBrands = await _context.Brands.CountAsync(),
                TotalRevenue = await _context.Orders.Where(o => o.PaymentStatus == PaymentStatus.Paid).SumAsync(o => o.Amount),
                OrdersByStatus = await _context.Orders.GroupBy(o => o.Status).Select(g => new { Status = g.Key.ToString(), Count = g.Count() }).ToListAsync(),
                ProductsByCategory = await _context.Categories.Select(c => new { c.Name, Count = c.Products.Count }).ToListAsync(),
                RecentOrders = await _context.Orders.OrderByDescending(o => o.CreatedAt).Take(10).Select(o => new { o.Id, o.UserName, o.Amount, Status = o.Status.ToString(), o.CreatedAt }).ToListAsync()
            };
            return Ok(stats);
        }


        [HttpGet("users")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _context.Users.Select(u => new
            {
                u.Id,
                u.UserName,
                u.Email,
                u.PhoneNumber,
                OrdersCount = _context.Orders.Count(o => o.UserId == u.Id),
                TotalSpent = _context.Orders.Where(o => o.UserId == u.Id && o.PaymentStatus == PaymentStatus.Paid).Sum(o => o.Amount)
            }).ToListAsync();
            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult> GetUserById(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var orders = await _context.Orders.Where(o => o.UserId == id).ToListAsync();

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.PhoneNumber,
                Orders = orders.Select(o => new { o.Id, o.Amount, Status = o.Status.ToString(), Payment = o.PaymentStatus.ToString(), o.CreatedAt })
            });
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("users/{id}/role")]
        public async Task<ActionResult> SetUserRole(string id, [FromBody] string role)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(new { message = $"Role {role} assigned to {user.UserName}" });
        }


        [HttpGet("products")]
        public async Task<ActionResult> GetAllProductsAdmin()
        {
            var products = await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Color)
                .Include(p => p.Size)
                .Include(p => p.Categories)
                .Include(p => p.Discounts)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ProductCode,
                    p.StockQuantity,
                    p.Status,
                    Brand = p.Brand.Name,
                    Color = p.Color.Name,
                    Size = p.Size.Name,
                    Categories = p.Categories.Select(c => c.Name).ToList(),
                    Discounts = p.Discounts.Select(d => new { d.Percentage, d.StartDate, d.EndDate }),
                    p.ImageUrl
                }).ToListAsync();
            return Ok(products);
        }

        [HttpPost("products")]
        public async Task<ActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            var product = new Domains.Entities.Products
            {
                Name = dto.Name,
                Description = dto.Description,
                Details = dto.Details,
                Price = dto.Price,
                ProductCode = dto.ProductCode,
                StockQuantity = dto.StockQuantity,
                Status = dto.Status,
                ColorId = dto.ColorId,
                SizeId = dto.SizeId,
                Composition = dto.Composition,
                CategoriesId = dto.CategoriesId,
                MatchProductsId = dto.MatchProductsId,
                ImageUrl = dto.ImageUrl,
                BrandId = dto.BrandId
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllProductsAdmin), new { id = product.Id }, product);
        }

        [HttpPut("products/{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Details = dto.Details;
            product.Price = dto.Price;
            product.ProductCode = dto.ProductCode;
            product.StockQuantity = dto.StockQuantity;
            product.Status = dto.Status;
            product.ColorId = dto.ColorId;
            product.SizeId = dto.SizeId;
            product.Composition = dto.Composition;
            product.CategoriesId = dto.CategoriesId;
            product.MatchProductsId = dto.MatchProductsId;
            product.ImageUrl = dto.ImageUrl;
            product.BrandId = dto.BrandId;

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete("products/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("categories")]
        public async Task<ActionResult> GetAllCategoriesAdmin()
        {
            var categories = await _context.Categories
                .Include(c => c.Products)
                .Include(c => c.ParentCategory)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.ImageUrl,
                    c.Type,
                    ParentCategory = c.ParentCategory != null ? c.ParentCategory.Name : null,
                    ProductsCount = c.Products.Count
                }).ToListAsync();
            return Ok(categories);
        }

        [HttpPost("categories")]
        public async Task<ActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                ParentCategoryId = dto.ParentCategoryId,
                Type = Enum.TryParse<CategoryType>(dto.Type, out var type) ? type : CategoryType.MassMarket
            };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllCategoriesAdmin), new { id = category.Id }, category);
        }

        [HttpPut("categories/{id}")]
        public async Task<ActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.ImageUrl = dto.ImageUrl;
            category.ParentCategoryId = dto.ParentCategoryId;
            category.Type = Enum.TryParse<CategoryType>(dto.Type, out var type) ? type : CategoryType.MassMarket;

            await _context.SaveChangesAsync();
            return Ok(category);
        }

        [HttpDelete("categories/{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/image")]
        public async Task<ActionResult<CategoryDto>> UpdateImageUrl(int id, [FromBody] string ImageUrl)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existingCategory = await _context.Categories.FindAsync(id);
                if (existingCategory == null)
                    throw new KeyNotFoundException($"Category with ID {id} not found");

                existingCategory.ImageUrl = ImageUrl;
                var updatedImageUrl = await _context.SaveChangesAsync();

                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating category with id {id}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpGet("brands")]
        public async Task<ActionResult> GetAllBrandsAdmin()
        {
            var brands = await _context.Brands
                .Include(b => b.Products)
                .Select(b => new { b.Id, b.Name, b.Description, b.LogoUrl, ProductsCount = b.Products.Count })
                .ToListAsync();
            return Ok(brands);
        }

        [HttpPost("brands")]
        public async Task<ActionResult> CreateBrand([FromBody] CreateBrandDto dto)
        {
            var brand = new Brand { Name = dto.Name, Description = dto.Description, LogoUrl = dto.LogoUrl };
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllBrandsAdmin), new { id = brand.Id }, brand);
        }

        [HttpDelete("brands/{id}")]
        public async Task<ActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null) return NotFound();
            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("orders")]
        public async Task<ActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.UserName,
                    o.Amount,
                    PaymentStatus = o.PaymentStatus.ToString(),
                    Status = o.Status.ToString(),
                    o.CreatedAt,
                    Items = o.Items.Select(i => new { i.ProductId, ProductName = i.Product.Name, i.Quantity, i.UnitPrice })
                }).ToListAsync();
            return Ok(orders);
        }

        [HttpPut("orders/{id}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            if (Enum.TryParse<OrderStatus>(status, out var orderStatus))
            {
                order.Status = orderStatus;
                await _context.SaveChangesAsync();
            }
            return Ok(order);
        }

        [HttpPut("orders/{id}/payment")]
        public async Task<ActionResult> UpdatePaymentStatus(int id, [FromBody] string paymentStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            if (Enum.TryParse<PaymentStatus>(paymentStatus, out var payStatus))
            {
                order.PaymentStatus = payStatus;
                await _context.SaveChangesAsync();
            }
            return Ok(order);
        }

        [HttpDelete("orders/{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();
            _context.OrderItems.RemoveRange(order.Items);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("colors")]
        public async Task<ActionResult> GetAllColors() => Ok(await _context.Colors.ToListAsync());

        [HttpPost("colors")]
        public async Task<ActionResult> CreateColor([FromBody] CreateColorDto dto)
        {
            var color = new Color { Name = dto.Name, HexCode = dto.HexCode };
            _context.Colors.Add(color);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllColors), new { id = color.Id }, color);
        }

        [HttpDelete("colors/{id}")]
        public async Task<ActionResult> DeleteColor(int id)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color == null) return NotFound();
            _context.Colors.Remove(color);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("sizes")]
        public async Task<ActionResult> GetAllSizes() => Ok(await _context.Sizes.ToListAsync());

        [HttpPost("sizes")]
        public async Task<ActionResult> CreateSize([FromBody] CreateSizeDto dto)
        {
            var size = new Size { Name = dto.Name };
            _context.Sizes.Add(size);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllSizes), new { id = size.Id }, size);
        }

        [HttpDelete("sizes/{id}")]
        public async Task<ActionResult> DeleteSize(int id)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size == null) return NotFound();
            _context.Sizes.Remove(size);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("discounts")]
        public async Task<ActionResult> GetAllDiscounts()
        {
            var discounts = await _context.Discounts
                .Include(d => d.Product)
                .Select(d => new { d.Id, d.ProductId, ProductName = d.Product.Name, d.Percentage, d.StartDate, d.EndDate })
                .ToListAsync();
            return Ok(discounts);
        }

        [HttpPost("discounts")]
        public async Task<ActionResult> CreateDiscount([FromBody] CreateDiscountDto dto)
        {
            var discount = new Discount
            {
                ProductId = dto.ProductId,
                Percentage = dto.Percentage,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };
            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllDiscounts), new { id = discount.Id }, discount);
        }

        [HttpDelete("discounts/{id}")]
        public async Task<ActionResult> DeleteDiscount(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null) return NotFound();
            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}