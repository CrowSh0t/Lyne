using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
}
