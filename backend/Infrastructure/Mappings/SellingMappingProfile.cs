using Application.Contracts.Brands;
using Application.Contracts.Categorys;
using Application.Contracts.Products;
using Application.Contracts.Selling;
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

    public class SellingMappingProfile : Profile
    {
        public SellingMappingProfile() { 
        
        CreateMap<Selling, SellingDto>().ReverseMap();

        CreateMap<CreateSellingDto, Selling>();

        CreateMap<UpdateSellingDto, Selling>();
         
        }
    }
}
