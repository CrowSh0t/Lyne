using Application.Contracts.Order;
using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System.Security.Claims;

namespace LyneBg.Controllers.Stripe
{
    [ApiController]
    [Route("api/[controller]")]
    public class StripeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public StripeController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST api/stripe/create-payment-intent
        [HttpPost("create-payment-intent")]
        [Authorize]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] CreateOrderDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.FindFirstValue(ClaimTypes.Name)
                ?? User.FindFirstValue("username");

            // Рахуємо суму з бази
            decimal totalAmount = 0;
            var orderItems = new List<(int ProductId, int Quantity, decimal UnitPrice)>();

            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    return BadRequest($"Product {item.ProductId} not found");

                orderItems.Add((product.Id, item.Quantity, product.Price));
                totalAmount += product.Price * item.Quantity;
            }

            // Stripe приймає суму в найменших одиницях (копійки/центи)
            // UAH → копійки (*100)
            var amountInKopecks = (long)(totalAmount * 100);

            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];

            var options = new PaymentIntentCreateOptions
            {
                Amount = amountInKopecks,
                Currency = "uah",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
                Metadata = new Dictionary<string, string>
                {
                    { "userId", userId ?? "" },
                    { "userName", userName ?? "" }
                }
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            return Ok(new
            {
                clientSecret = intent.ClientSecret,
                amount = totalAmount
            });
        }

        // POST api/stripe/webhook
        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook()
        {
            var webhookSecret = _configuration["Stripe:WebhookSecret"];
            var stripeSecretKey = _configuration["Stripe:SecretKey"];

            string json;
            using (var reader = new StreamReader(HttpContext.Request.Body))
            {
                json = await reader.ReadToEndAsync();
            }

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    webhookSecret
                );

                if (stripeEvent.Type == "payment_intent.succeeded")
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    if (paymentIntent == null) return Ok();

                    var userId = paymentIntent.Metadata.GetValueOrDefault("userId");
                    var userName = paymentIntent.Metadata.GetValueOrDefault("userName");

                    // Знаходимо замовлення зі статусом Pending для цього користувача
                    var order = await _context.Orders
                        .Where(o => o.UserId == userId && o.PaymentStatus == PaymentStatus.Pending)
                        .OrderByDescending(o => o.CreatedAt)
                        .FirstOrDefaultAsync();

                    if (order != null)
                    {
                        order.PaymentStatus = PaymentStatus.Paid;
                        order.Status = OrderStatus.Processing;
                        await _context.SaveChangesAsync();
                    }
                }

                return Ok();
            }
            catch (StripeException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST api/stripe/confirm-order  — створює Order після успішної оплати
        [HttpPost("confirm-order")]
        [Authorize]
        public async Task<IActionResult> ConfirmOrder([FromBody] ConfirmOrderRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.FindFirstValue(ClaimTypes.Name)
                ?? User.FindFirstValue("username");

            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];

            // Перевіряємо PaymentIntent у Stripe
            var piService = new PaymentIntentService();
            PaymentIntent intent;
            try
            {
                intent = await piService.GetAsync(request.PaymentIntentId);
            }
            catch
            {
                return BadRequest("Invalid payment intent");
            }

            if (intent.Status != "succeeded")
                return BadRequest($"Payment not succeeded. Status: {intent.Status}");

            // Створюємо замовлення
            var order = new Order
            {
                UserId = userId!,
                UserName = userName,
                Status = OrderStatus.Processing,
                PaymentStatus = PaymentStatus.Paid
            };

            decimal totalAmount = 0;
            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null) continue;

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };
                totalAmount += orderItem.UnitPrice * orderItem.Quantity;
                order.Items.Add(orderItem);
            }
            order.Amount = totalAmount;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { orderId = order.Id });
        }
    }

    public class ConfirmOrderRequest
    {
        public string PaymentIntentId { get; set; } = "";
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}
