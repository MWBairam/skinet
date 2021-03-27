using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using API.Extensions;
using API.Helper;
using API.MiddleWare;
using AutoMapper;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

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



            //add the AutoMapper service:
            //define in it the location of the Mapping profile we want using typeof()
            //the mapping profile we created is in API Project -> Helper folder
            services.AddAutoMapper(typeof(MappingProfiles));




            services.AddControllers();
            
            




            //add the DbContext service, while using sqlite, with the configured connection string in appsettings.Development.json
            //   services.AddDbContext<StoreContext>(x => x.UseSqlite(_config.GetConnectionString("DefaultConnection")));
            //also, add the second context we have, AppIdentityContext:
            //   services.AddDbContext<AppIdentityDbContext>(x => {x.UseSqlite(_config.GetConnectionString("IdentityConnection"));});
            /*
            and since we have 2 contexts now !
            1-the one we created in video 17 for the products, brands ,... tables and we called it StoreContext 
            2-the one we have just created, to hold the identity tables, and we called it AppIdentityDbContext
            so we have 2 databases, with 2 conenctionstrings  !
            */
            //the above services uses sqlite DB which we used during development,
            //now rewritting those to use postgresql which will be used in our final development stages and production env:
            services.AddDbContext<StoreContext>(x => x.UseNpgsql(_config.GetConnectionString("DefaultConnection")));
            services.AddDbContext<AppIdentityDbContext>(x => {x.UseNpgsql(_config.GetConnectionString("IdentityConnection"));});





            //add the service of Redis:
            //we installed Redis package in the Infrastructure Project which will communicate with it,
            //we will add this service as a singleton service,
            //just like how we used StoreContext (an application DBcontext which we created in the Infrastructure project using EntityFramework)
            //to communicate with the sql DB, we use here a nearly equal concept which is called "IConnectionMultiplexer" but it is already provided by Redis and we do not create it.
            //we used here also a connection string called "Redis" which is existed in our appsettings.json ("Redis": "localhost")
            services.AddSingleton<IConnectionMultiplexer>
            (
                c =>
                {
                    var configuration = ConfigurationOptions.Parse(_config.GetConnectionString("Redis"), true);
                    return ConnectionMultiplexer.Connect(configuration);
                }
            );
            //and we used Redis to store customers' baskets and in it basket items.
            //we used for that IBasketRepository and BasketRepository so we need to register these here:
            //we added that in the ApplicationServicesExtensions in the middleware folder,
            //and got that returned in the below sesrvices.AddApplicationServices().




            //bring the service written in the Extentions folder -> ApplicationServicesExtensions class:
            //(we wrote those services there to empty more space in here)
            services.AddApplicationServices();
            //bring the service written in the Extentions folder -> IdentityServiceExtensions:
            //(we wrote those services there to empty more space in here)
            services.AddIdentityServices(_config);
            //pass the above _config property which is of type IConfiguration
            //which allows us to read the appSettings.Development.json and appSettings.json files 



            services.AddSwaggerDocumentation();





            //Configure CORS:
            //enable (CORS))Cross origin Resource sharing support on our API so Angular developer can work on what we are returning from our API 
            //so we send an appropriate header in our responses to our Anguler clients (API Consumers) 
            //it is a mechanism that's used to tell browsers to give a web application running at one origin an access to selected resources from a different origin 
            //,and for security reasons, browsers restrict cross origin  HTTP requests initiated from javascript. 
            //So if we want to see our results coming back from the API in the browser then we're going to need to send back across origin resource sharing header to enable that to happen.
            services.AddCors(opt => {opt.AddPolicy("CorsPolicy", policy => {policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");});});
            //we specified the link where our angular client will be coming from
            //and basically we are telling our client application if it is running on an unsecure port, we will not return a header that is going to allow the browser to display the returned data
            //then add its middleware below 
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
            
            //this is to tell the API project to serve the static files (like images) from the wwwroot folder:
            app.UseStaticFiles();
            //this is to tell the API project to serve the static files (like images) from the Content folder,
            //and to know why we need this, please read the notes below in the bottom of this file in app.UseEndpoints.
            app.UseStaticFiles
            (
                new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Content")), RequestPath = "/content"
            }
            );

            //this is related to the above services.AddCors:
            app.UseCors("CorsPolicy");
            
            //those are related to the microsoft identity functionality like using [Authorize] attribute
            //in the controller method so those are called by the logged in users only !
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                endpoints.MapFallbackToController("Index", "Fallback");
                /*
                what is this middleware?
                -Angular translates its code to a pure javascript code when we do "client>ng serve" or "client>ng build" in the termianl.
                 And those js files are kept inside the "client" project, in dist/client folder which is hidden.
                 (
                  Note: this dir is mentioned in angular.json file, "outputPath" property
                 )
                 (
                  Note: js files version is javascript ECMA target version equals to es2015. 
                  (as written in tsconfig.json, "target" property in "client" project)
                  which is the newest one.
                  But also, it will create a copy of es5 for the older browssers' versions.
                 )
                
                -We want to publish our complete solution, so:
                 In angular.json file, in "outputpath" property, in the "client" project, we changed the output directory 
                 from dist/client to ../API/wwwroot.
                 This means next time we do "client>ng build", the translated js files (+ client/src/assets folder)
                 will be existed in the API project, wwwroot folder. 
                 (
                   Note: unfortunately, angulaer will delete every thing in API/wwwroot ! including our images/products folder where we kept
                   the products images ! 
                   Remember the prduct's image full path is https://localhost:5001/images/products/<image_name> as we wrote that in the DB and used the help of API/Helper/ProductUrlResolver.
                   So in order not to change a lot, we moved the pictures to the API/Content folder,
                   and we need to serve static files from that COntent folder, so that if the image is not found in wwwroot, the API project will look for it in Content folder.
                   which is done in the above app.UseStaticFiles middleware.
                   Also need to modify the ApiUrl property we created in appDevelopment.json as well.
                 )
                -Now instead of running 2 projects:
                 API>ditnet watch run
                 client>ng server
                 and visit the website using https://localhost:4200 (angular project url:port),
                 we can run only the API prject since the js files are in wwwroot folder:
                 API>dotnet watch run
                 and visit the website using https://localhost/5001 (API project web url:port)
                -So now since we are using the https://localhost/5001 to visit the website, 
                 we need to tell this API project to load index.html which is now in wwwroot folder !
                 (it was in client/src folder)
                 and in orde to do that, we created an MVC controller to return the path wwwroot/index.html 
                 once the user visits https://localhost/5001.
                 we called it FallbackController.
                */
            });
        }
    }
}
