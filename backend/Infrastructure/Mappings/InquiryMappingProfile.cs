using Application.Contracts.Inquiries;
using Application.Contracts.Inquiry;
using AutoMapper;
using Domains.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Mappings
{
    public class InquiryMappingProfile : Profile
    {
        public InquiryMappingProfile()
        {
            CreateMap<CreateInquiryDto, SupportInquiry>();

            CreateMap<SupportInquiry, InquiryDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));


            CreateMap<CreateInquiryDto, SupportInquiry>()
    .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Text))
    .ForMember(dest => dest.Subject, opt => opt.MapFrom(src => src.Phone ?? "Без теми")); 


        }
    }
}
