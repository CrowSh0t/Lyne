using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class Size
    {
        public int Id { get; set; }
        public required string Name { get; set; } // XS, S, M, L, XL, XXL
        public ICollection<Products> Products { get; set; } = new List<Products>();
    }
}
