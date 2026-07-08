// Domains/Entities/Products.cs
namespace Domains.Entities
{
    public class Products
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Details { get; set; }
        public decimal Price { get; set; }
        public string? ProductCode { get; set; } // нове поле "код"
        public int StockQuantity { get; set; } // нове поле "кількість"
        public string? Status { get; set; } // нове поле "status" (наприклад Available, OutOfStock)

        // Зв'язки замість enum
        public int ColorId { get; set; }
        public Color Color { get; set; }
        public int SizeId { get; set; }
        public Size Size { get; set; }

        public string? Composition { get; set; }
        public required List<int> CategoriesId { get; set; }
        public List<int>? MatchProductsId { get; set; }
        public List<string>? ImageUrl { get; set; }

        public int BrandId { get; set; }
        public Brand Brand { get; set; }

        public ICollection<Category> Categories { get; set; } = new List<Category>();
        public ICollection<Discount> Discounts { get; set; } = new List<Discount>();
    }
}