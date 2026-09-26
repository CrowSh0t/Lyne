// LyneBg/Controllers/OrdersController.cs
using Application.Contracts.Order;
using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LyneBg.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OrdersController(ApplicationDbContext context) => _context = context;

        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.FindFirstValue(ClaimTypes.Name)
            ?? User.FindFirstValue("username")
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var order = new Order
            {
                UserId = userId,
                UserName = userName,
                Status = OrderStatus.New,
                PaymentStatus = PaymentStatus.Pending
            };

            decimal totalAmount = 0;
            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null) return BadRequest($"Product {item.ProductId} not found");

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price // можна з урахуванням знижки
                };
                totalAmount += orderItem.UnitPrice * orderItem.Quantity;
                order.Items.Add(orderItem);
            }
            order.Amount = totalAmount;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var orderDto = new OrderDto
            {
                Id = order.Id,
                UserName = order.UserName,
                Amount = order.Amount,
                PaymentStatus = order.PaymentStatus.ToString(),
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();

            return new OrderDto
            {
                Id = order.Id,
                UserName = order.UserName,
                Amount = order.Amount,
                PaymentStatus = order.PaymentStatus.ToString(),
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            if (!Enum.TryParse<OrderStatus>(status, ignoreCase: true, out var parsedStatus))
                return BadRequest($"Invalid status: {status}");

            order.Status = parsedStatus;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("by-username/{userName}")]
        public async Task<ActionResult> GetOrderByUserName(string userName)
        {
            var orders = await _context.Orders
                .Where(o => o.UserName.ToLower() == userName.ToLower()
                         && o.Status != OrderStatus.Cancelled) // ← фільтр
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
                    Items = o.Items.Select(i => new
                    {
                        i.ProductId,
                        ProductName = i.Product != null ? i.Product.Name : null,
                        i.Quantity,
                        i.UnitPrice
                    })
                }).ToListAsync();

            return Ok(orders);
        }
        [HttpGet("my-orders")]
        [Authorize] // Обов'язково потрібен токен
        public async Task<IActionResult> GetMyOrders()
        {
            
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Не вдалося ідентифікувати користувача.");
            }

           
            var orders = await _context.Orders
                .Where(o => o.UserId == userId && o.Status != OrderStatus.Cancelled)
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
                    Items = o.Items.Select(i => new
                    {
                        i.ProductId,
                        ProductName = i.Product != null ? i.Product.Name : null,
                        i.Quantity,
                        i.UnitPrice
                    })
                }).ToListAsync();

            return Ok(orders);
        }


    }
    
}