using System.Linq;
using AutoMapper;
using X.PagedList;
using ZawajAPI.DTOs;
using ZawajAPI.Models;

namespace ZawajAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<UserRegisterDTO, User>()
            .ForMember(dest => dest.Gender,map => {map.MapFrom(src => src.Gender==1?"رجل":"إمرأة");});

CreateMap<IPagedList, UserListDTO>();
            CreateMap<User, UserListDTO>()
            .ForMember(dest => dest.PhotoURL, map => { map.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url); })
            .ForMember(dest => dest.Age, map => { map.MapFrom(src => src.BirthDate.CalculateAge()); });

            CreateMap<User, UserDetailsDTO>()
            .ForMember(dest => dest.PhotoURL, map => { map.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url); })
            .ForMember(dest => dest.Age, map => { map.MapFrom(src => src.BirthDate.CalculateAge()); });

            CreateMap<UserUpdateDTO, User>();

            CreateMap<Photo, PhotoDetailsDTO>();
            CreateMap<PhotoAddDTO,Photo>();
        }
    }
}