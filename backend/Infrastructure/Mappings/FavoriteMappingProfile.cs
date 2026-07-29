// Infrastructure/Mappings/FavoriteMappingProfile.cs
using Application.Contracts.Favorites;
using AutoMapper;
using Domains.Entities;

namespace Infrastructure.Mappings
{
    public class FavoriteMappingProfile : Profile
    {
        public FavoriteMappingProfile()
        {
            CreateMap<UserFavorite, UserFavoriteDto>();
        }
    }
}
