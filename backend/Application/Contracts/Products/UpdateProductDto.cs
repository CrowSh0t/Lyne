using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Products
{
    public class UpdateProductDto
    {
        public string Name { get; set; }
        public int BrandId { get; set; }
        public string Description { get; set; }
        public string Details { get; set; }
        public int ColorId { get; set; }
        public int? SizeId { get; set; }
        public string? Composition { get; set; }
        public List<int> CategoriesId { get; set; }
        public List<int>? MatchProductsId { get; set; }
        public List<string>? ImageUrl { get; set; }
    }
}
