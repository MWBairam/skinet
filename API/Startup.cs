using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using API.Extensions;
using API.Helper;
using API.MiddleWare;
using AutoMapper;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;


namespace API
{
    public class Startup
    {
        //instead of the followings:
        // public Startup(IConfiguration configuration)
        // {
        //     Configuration = configuration;
        // }
        // public IConfiguration Configuration { get; }
        //we would like to re-write it again as most of developers do:

        public readonly IConfiguration _config;
        public Startup(IConfiguration configuration)
        {
            _config = configuration;
        }








        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {


            services.AddControllers();
            //bring the service written in the Extentions foldr -> ApplicationServicesExtensions class:
            //(we wrote those services there to empty more space in here)
            services.AddApplicationServices();

            services.AddSwaggerDocumentation();



            //add the DbContext service, while using sqlite, with the configured connection string in appsettings.Development.json
            services.AddDbContext<StoreContext>(x => x.UseSqlite(_config.GetConnectionString("DefaultConnection")));

            //add the AutoMapper service:
            //define in it the location of the Mapping profile we want using typeof()
            //the mapping profile we created is in API Project -> Helper folder
            services.AddAutoMapper(typeof(MappingProfiles));



        }











        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                //instead of using the following midleware for exception handling during development mode only,
                //we will use the ExceptionMiddleWare class in the MiddleWare folder out of this if for development and production environment
                //app.UseDeveloperExceptionPage();


                //use the Swagger MiddleWare from the Extensions folder -> SwaggerServiceExtensions:
                //(we wrote that MidlleWare there to empty more space in here)
                app.UseSwaggerDocumentation();
            }
            
            //our created exception handler for development and production environment instead of the above app.UseDeveloperExceptionPage();
            app.UseMiddleware<ExceptionMiddleWare>();

            app.UseStatusCodePagesWithReExecute("/errors/{0}");

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseStaticFiles();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
