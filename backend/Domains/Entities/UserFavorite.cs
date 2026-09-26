// Domains/Entities/UserFavorite.cs
namespace Domains.Entities
{
    public class UserFavorite
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public int ProductId { get; set; }
        public Products Product { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
