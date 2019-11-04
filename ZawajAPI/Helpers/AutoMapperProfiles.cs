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
            .ForMember(dest => dest.Gender, map => { map.MapFrom(src => src.Gender == 1 ? "رجل" : "إمرأة"); });

            CreateMap<IPagedList, PagedList>();
            CreateMap<User, UserListDTO>()
            .ForMember(dest => dest.PhotoURL, map => { map.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url); })
            .ForMember(dest => dest.Age, map => { map.MapFrom(src => src.BirthDate.CalculateAge()); })
            .ForMember(dest => dest.isLiking, map => { map.MapFrom(src => src.LikesFrom.Where(l => l.LikeToUserId == src.Id).Count() > 0 ? true : false); });

            CreateMap<User, UserDetailsDTO>()
            .ForMember(dest => dest.PhotoURL, map => { map.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url); })
            .ForMember(dest => dest.Age, map => { map.MapFrom(src => src.BirthDate.CalculateAge()); });

            CreateMap<UserUpdateDTO, User>();

            CreateMap<Photo, PhotoDetailsDTO>();

            CreateMap<PhotoAddDTO, Photo>();

            CreateMap<User, LikeListDTO>()
            .ForMember(dest => dest.PhotoURL, map => { map.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url); })
            .ForMember(dest => dest.Age, map => { map.MapFrom(src => src.BirthDate.CalculateAge()); });

            CreateMap<LikeAddDTO, Like>();

            CreateMap<User, ChatUsersListDTO>()
            .ForMember(dest => dest.PhotoURL, map => { map.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url); });

            CreateMap<ChatAddDTO,Message>();
        }
    }
}