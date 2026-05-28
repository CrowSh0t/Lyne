namespace Domains.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

        public ICollection<Products> Products { get; set; } = new List<Products>();
    }
}