using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ZawajAPI.Data;
using Microsoft.EntityFrameworkCore;
using ZawajAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using ZawajAPI.Helpers;
using ZawajAPI.Data.TrialsData;
using ZawajAPI.Domain.IRepository;
using ZawajAPI.Domain.Repository;
using AutoMapper;
using ZawajAPI.Hubs;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Stripe;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

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
            services.AddDbContext<ZawajDbContext>(x =>
            x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

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
                option.User.RequireUniqueEmail = false;
                option.Password.RequireDigit = false;
                option.Password.RequireLowercase = false;
                option.Password.RequiredLength = 4;
                option.Password.RequireNonAlphanumeric = false;
                option.Password.RequireUppercase = false;
            })
            .AddRoles<Role>()
            .AddClaimsPrincipalFactory<UserClaimsPrincipalFactory<User, Role>>()
            .AddEntityFrameworkStores<ZawajDbContext>()
            .AddRoleValidator<RoleValidator<Role>>()
            .AddSignInManager<SignInManager<User>>()
            .AddRoleManager<RoleManager<Role>>()
            .AddDefaultTokenProviders()
            .AddDefaultUI();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(option =>
            {
                option.RequireHttpsMetadata = false;
                option.SaveToken = true;
                option.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Tokens:Issuer"],
                    ValidAudience = Configuration["Tokens:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Tokens:Key"]))
                };
            });
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            services.Configure<StripeSettings>(Configuration.GetSection("Stripe"));

            /* services.AddAuthentication(AzureADB2CDefaults.BearerAuthenticationScheme)
                .AddAzureADB2CBearer(options => Configuration.Bind("AzureAdB2C", options)); */
            services.AddMvc(options =>
            {
                // --> to apply authorization on all controller without [Authorize] attribute:
                var policy = new AuthorizationPolicyBuilder()
                            .RequireAuthenticatedUser()
                            .Build();
                options.Filters.Add(new AuthorizeFilter(policy));                
                // -->  to add LastActive DateTime to every authorized user 
                options.Filters.Add<UserActiveActionFilter>();
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
            .AddJsonOptions(option =>
            { option.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore; });
            services.AddCors();
            services.AddSignalR();
            services.AddAutoMapper(typeof(Startup));
            services.AddTransient<TrialData>();
            services.AddScoped<UserActiveActionFilter>();
            //services.AddAllRepository(Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, TrialData trialData)
        {
            string corsOrigin = "http://localhost:4200";
            //StripeConfiguration.SetApiKey(Configuration.GetSection("Stripe:SecretKey").Value);
            StripeConfiguration.ApiKey = Configuration.GetSection("Stripe:SecretKey").Value;
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(BuilderExtensions =>
                {
                    BuilderExtensions.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message, corsOrigin);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
                // app.UseHsts();
            }
            /* app.UseSpa(spa =>  
            {  
                // To learn more about options for serving an Angular SPA from ASP.NET Core,  
                // see https://go.microsoft.com/fwlink/?linkid=864501  
  
                spa.Options.SourcePath = "ZawajSPA";  
  
                if (env.IsDevelopment())  
                {  
                    //spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");  
                    spa.UseAngularCliServer(npmScript: "start");  
                }  
            });  */

            trialData.TrialUsers();
            app.UseHttpsRedirection();
            app.UseCors(x => x.WithOrigins(corsOrigin).AllowAnyHeader().AllowAnyMethod());
            app.UseSignalR(options =>
            {
                options.MapHub<ChatHub>("/chatHub");
            });
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
