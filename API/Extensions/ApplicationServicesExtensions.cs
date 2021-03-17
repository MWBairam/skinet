using System.Linq;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{

    //creating the Extensions folder in the API project, and in it 2 classes ApplicationServiceExtension + SwaggerServiceExtension (and 2 classes for Identity Services)
    //inside these 2 classes, we write services that occupy a lot of space in the start up file so startup file looks better !
    //it is not ncessary, but good to do it 

    //make this class static, so when we call it in the startup file, we do not make an instance of it
    public static class ApplicationServicesExtensions
    {
        //the following function should be static as well since the class is static
        //this function return a collection of services we will write in it
        //we should mention the keyword "this" before the below parameter, so that "return service" will mean to return all the Services written in this function
        //this class is function in the startup.cs file
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            //add the interfaces/implementations services:

            //when it comes to "caching" concept, it is better to register this service as singleton
            //so it is available any time for any user:
            services.AddSingleton<IResponseCacheService, ResponseCacheService>();

            

            //when the user logins/registers, he gets a token to send with each subsequent https request.
            //to generate a token, we created the ITokenService interface and its implementation in TokenService
            //(in Core project, interfaces folder and in Infrastructure project, services folder)
            //and injected the service in the AccountController.
            //add the interface and its implementation in startup file (or in AppicationServicesExtensions)
            //and add the Authentication service with tokens in startup file (or in the IdentityServiceExtensions)
            services.AddSingleton<ITokenService, TokenService>();


            
            //services.AddScoped<IProductRepository, ProductRepository>();
            //that service is not used anymore since we are using the below IgenericRepository interface and its GenericRepository Implementation




            //add the generic interface/implementation service:
            services.AddScoped(  typeof(IGenericRepository<>) , (  typeof(GenericRepository<>)  ) );

  
            //and we used Redis to store customers' baskets and in it basket items.
            //we used for that IBasketRepository and BasketRepository so we need to register these here:
            //(redis connection string service is in startup.cs)
            services.AddScoped<IBasketRepository, BasketRepository>();



            //add the IOrderService and OrderService as scoped here:
            services.AddScoped<IOrderService, OrderService>();



            //add the IPyamentService nd PaymentService where we deal with the third party payment processor "Stripe":
            services.AddScoped<IPaymentService, PaymentService>();

            //the services realted to submit a message from the contact us page:
            services.AddScoped<IMessageService, MessageService>();

            
            //add this service to shape the validation-based bad request errors as we designed in the ApiValidationErrorResponse class in the Errors folder:
            //indeed, the services order in here is not important, but there are alawys exceptions,
            //the following service should be after the services.AddControllers(); service in the startup file:
            services.Configure<ApiBehaviorOptions>(options => 
            {
                //InvalidModelStateResponseFactory is from where we generate the Invalid Model errors
                options.InvalidModelStateResponseFactory = ActionContext =>
                {
                    //errors will be an array
                    //using .where, we figure out if there are errors generated or no !
                    //then select all the errors
                    //then select the error messages from these errors
                    //then save them as an array
                    var errors = ActionContext.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToArray();
                    //now initialize an instance of the ApiValidationErrorResponse class
                    //it has an attribute IEnumerable<string> called "Errors", fill it with the previously created "errors" array
                    var errorResponse = new ApiValidationErrorResponse 
                    {
                        Errors = errors
                    };
                    //now return the ApiValidationErrorResponse instance (errorResponse) in a bad request result 
                    return new BadRequestObjectResult(errorResponse);
                };
            }); 


            return services;

        }




















    }
}