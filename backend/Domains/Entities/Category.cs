namespace Domains.Entities
{
    public enum CategoryType { MassMarket, Premium }

    public class Category
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; } // нове
        public int? ParentCategoryId { get; set; } // для вкладеності
        public Category? ParentCategory { get; set; }
        public CategoryType Type { get; set; } = CategoryType.MassMarket; // масмаркет чи преміум

        public ICollection<Products> Products { get; set; } = new List<Products>();
    }
}