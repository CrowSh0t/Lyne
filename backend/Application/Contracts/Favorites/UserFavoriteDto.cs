// Application/Contracts/Favorites/UserFavoriteDto.cs
using Application.Contracts.Products;

namespace Application.Contracts.Favorites
{
    public class UserFavoriteDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public ProductDto Product { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
