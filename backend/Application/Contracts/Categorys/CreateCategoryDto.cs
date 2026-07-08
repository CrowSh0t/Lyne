using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Categorys
{
    public class CreateCategoryDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int? ParentCategoryId { get; set; }
        public string Type { get; set; } = "MassMarket";
        public List<int>? ProductsId { get; set; }
    }
}
