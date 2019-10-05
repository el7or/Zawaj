using System.Linq;
using AutoMapper;
using ZawajAPI.DTOs;
using ZawajAPI.Models;

namespace ZawajAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserListDTO>()
            .ForMember(dest => dest.PhotoURL, map => { map.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url); })
            .ForMember(dest => dest.Age, map => { map.MapFrom(src => src.BirthDate.CalculateAge()); });

            CreateMap<User, UserDetailsDTO>()
            .ForMember(dest => dest.PhotoURL, map => { map.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url); })
            .ForMember(dest => dest.Age, map => { map.MapFrom(src => src.BirthDate.CalculateAge()); });

            CreateMap<Photo, PhotoDetailsDTO>();
        }
    }
}