using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class Color
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? HexCode { get; set; } 
        public ICollection<Products> Products { get; set; } = new List<Products>();
    }
}
