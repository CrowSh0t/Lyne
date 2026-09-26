using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class Discount
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Products Product { get; set; }
        public decimal Percentage { get; set; } // наприклад 15.5 означає 15.5%
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
