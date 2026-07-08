using Application.Contracts.Brands;
using Application.Contracts.Categorys;
using Application.Contracts.Products;
using AutoMapper;
using Domains.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Infrastructure.Mappings
{
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile()
        {
            CreateMap<Products, ProductDto>();
            CreateMap<CreateProductDto, Products>();
            CreateMap<UpdateProductDto, Products>();

            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.ProductsId,
                           opt => opt.MapFrom(src => src.Products.Select(p => p.Id).ToList()));

            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            // В Infrastructure/Mappings/ProductMappingProfile.cs
            CreateMap<Brand, BrandDto>()
                .ForMember(dest => dest.ProductsId,
                           opt => opt.MapFrom(src => src.Products.Select(p => p.Id).ToList()));

            CreateMap<CreateBrandDto, Brand>();
            CreateMap<UpdateBrandDto, Brand>();
        }
    }
}
