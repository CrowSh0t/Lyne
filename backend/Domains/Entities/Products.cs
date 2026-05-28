// Domains/Entities/Products.cs
namespace Domains.Entities
{
    public class Products
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public required string Description { get; set; }
        public required string Details { get; set; }

        // Enum властивості
        public Colors Color { get; set; }
        public Sizes Size { get; set; }  // ← Переконайся що це поле є!

        public string? Composition { get; set; }
        public required List<int> CategoriesId { get; set; }
        public List<int>? MatchProductsId { get; set; }
        public List<string>? ImageUrl { get; set; }

        // Brand - зовнішній ключ
        public int BrandId { get; set; }  // ← Переконайся що це поле є!
        public Brand Brand { get; set; }

        // Навігаційна властивість для many-to-many з категоріями
        public ICollection<Category> Categories { get; set; } = new List<Category>();
    }
}