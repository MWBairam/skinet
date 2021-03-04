using System.Text;
using Core.Entities.Identity;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{

    //creating the Extensions folder in the API project, and in it 2 classes ApplicationServiceExtension + SwaggerServiceExtension (and 2 classes for Identity Services)
    //inside these 2 classes, we write services that occupy a lot of space in the start up file so startup file looks better !
    //it is not ncessary, but good to do it 

    //make this class static, so when we call it in the startup file, we do not make an instance of it
    public static class IdentityServiceExtensions
    {
        //the following function should be static as well since the class is static
        //this function return a collection of services we will write in it
        //we should mention the keyword "this" before the below parameter, so that "return service" will mean to return all the Services written in this function
        //this class is function in the startup.cs file
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            var builder = services.AddIdentityCore<AppUser>();

            builder = new IdentityBuilder(builder.UserType, builder.Services);
            builder.AddEntityFrameworkStores<AppIdentityDbContext>(); //add the EntityFrameWorkStores which brings to us the UserManager service
            builder.AddSignInManager<SignInManager<AppUser>>(); //add the SignInManager service 
            //the SignIn manager requiers the AddAuthentication service:
            //   services.AddAuthentication();
            //we discarded it, and used the below Authentication with Jwt tokens:

            //when the user logins/registers, he gets a token to send with each subsequent https request.
            //to generate a token, we created the ITokenService interface and its implementation in TokenService.
            //(in Core project, interfaces folder and in Infrastructure project, services folder).
            //and injected the service in the AccountController.
            //add the interface and its implementation in startup file (or in AppicationServicesExtensions).
            //and add the Authentication service with tokens in startup file (or in the IdentityServiceExtensions).
            //for that aslo, we need the above passed IConfiguration config which allows us to read the appSettings.Development.json file
             services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                 .AddJwtBearer(options => 
                 {
                     options.TokenValidationParameters = new TokenValidationParameters
                     {
                         //when adding thisAuthentication service, specify the options parameters here:
                         //in TokenService, we said that the API project will sign the token, 
                         //so say that we want to validate the key and Issuer:
                         ValidateIssuerSigningKey = true,
                         ValidateIssuer = true,
                         ValidateAudience = false,
                         //and say what key is valid and who is the valid Issuer:
                         //as we did in TokenService, the original key we used and the Issuer we wrote in appSettings.Development.json file
                         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                         ValidIssuer = config["Token:Issuer"],
                     };
                 });
                 //after tht add the app.UseAuthentication() in startup file in Configure method.

            return services;
        }
    }
}