using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace API.Extensions
{

    //creating the Extensions folder in the API project, and in it 2 classes ApplicationServiceExtension + SwaggerServiceExtension
    //inside these 2 classes, we write services that occupy a lot of space in the start up file so startup file looks better !
    //it is not ncessary, but good to do it 

    //make this class static, so when we call it in the startup file, we do not make an instance of it
    public static class SwaggerServiceExtensions
    {
        //the following function should be static as well since the class is static
        //this function return a collection of services we will write in it
        //we should mention the keyword "this" before the parameter, so that "return service" will mean to return all the Services written in this function
        //this function is called in the startup.cs file
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Skinet API", Version = "v1" });
            });

            return services;
        }






        //for swagger, another function is requiered to return its middleware in the "Configure" function in startup file:
        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
        {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));

                return app;
        }
    }
}