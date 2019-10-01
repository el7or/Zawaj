using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ZawajAPI.Domain.IRepository;
using ZawajAPI.Domain.Repository;

namespace ZawajAPI.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message, string corsOrigin)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", corsOrigin);
        }

        public static IServiceCollection AddAllRepository(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IUserRepo, UserRepo>();
            return services;
        }

        public static int CalculateAge(this DateTime dateTime){
           var age = DateTime.Today.Year-dateTime.Year;
           if(dateTime.AddYears(age)>DateTime.Today) {age--;}
           return age;
       }
    }
}