using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.AzureADB2C.UI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ZawajAPI.Data;
using Microsoft.EntityFrameworkCore;
using ZawajAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace ZawajAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ZawajDbContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            /* IdentityBuilder builder = services.AddIdentityCore<User>(opt =>
            {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
            });
            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<ZawajDbContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>(); */

            services.AddIdentityCore<User>(option =>
            {
                option.User.RequireUniqueEmail=true;
                option.Password.RequireDigit = false;
                option.Password.RequireLowercase = false;
                option.Password.RequiredLength = 4;
                option.Password.RequireNonAlphanumeric = false;
                option.Password.RequireUppercase = false;
            })
            .AddRoles<Role>()
            .AddClaimsPrincipalFactory<UserClaimsPrincipalFactory<User, Role>>()
            .AddEntityFrameworkStores<ZawajDbContext>()
            .AddDefaultTokenProviders()
            .AddDefaultUI();

            services.AddAuthentication(AzureADB2CDefaults.BearerAuthenticationScheme)
                .AddAzureADB2CBearer(options => Configuration.Bind("AzureAdB2C", options));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseCors(x => x.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod());
            app.UseMvc();
        }
    }
}
