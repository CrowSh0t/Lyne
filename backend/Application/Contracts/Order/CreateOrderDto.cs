using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Order
{
    public class CreateOrderDto
    {
        public List<CreateOrderItemDto> Items { get; set; }
    }
}
