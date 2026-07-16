using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Selling
{
    public class SellingDto
    {
        public int id { get; set; }
        public int ProductId { get; set; }

        public DateTime StartSelling { get; set; }

        public DateTime EndSelling { get; set; }

    }
}
