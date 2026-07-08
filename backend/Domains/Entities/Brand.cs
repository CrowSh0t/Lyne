namespace Domains.Entities
{
    public class Brand
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }

        // Навігаційна властивість - всі продукти цього бренду
        public ICollection<Products> Products { get; set; } = new List<Products>();
    }
}