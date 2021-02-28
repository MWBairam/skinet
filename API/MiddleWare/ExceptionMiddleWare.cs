using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.MiddleWare
{

    //this class will be used instead of the following in the startup file:
    //if (env.IsDevelopment())
    //{
    //     app.UseDeveloperExceptionPage();
    //}
    //will be used as the MiddleWare which throws the exceptions whether we are in development mode, or production mode
    //and in the shape we want which was designed in Errors folder !
    //we will use try and catch as below 

    public class ExceptionMiddleWare
    {


        //Attributes:
        //1-first one is of RequestDelegate type, we will know its function below later
        //2-second one is of ILogger type, whcih is a logger to write a log to a console
        //3-third one is of IHostEnvironment type, and using it, we will determine if we are in the Development mode or Production Mode
        public readonly RequestDelegate _next;
        public readonly ILogger<ExceptionMiddleWare> _logger;
        public readonly IHostEnvironment _env;





        //Constructor:
        //it has 3 parameters
        public ExceptionMiddleWare(RequestDelegate next, ILogger<ExceptionMiddleWare> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }




        //Metods:
        //this method is responsible for logging to a console,  and returning an exception besides the exception stack trace !
        public async Task InvokeAsync(HttpContext httpcontext)
        {
            //How we can generate an exception ?
            //simply use the try catch utility !
            try
            {
                await _next(httpcontext);
                //remember that _next is a RequestDelegate, which is a function that handles an http request !
                //this line of code simply means that if there is no exception ! so skip this Exception midleware and and let the http request go to the next middle ware
                //what do we mean by the middlewares ?
                //in startup file, Configure function, the app. lines, each one of those is a middleware is being used in our application,
                //the first one usually  is the app.UseDeveloperExceptionPage(); as we said above at the beginning of this class,
                //then comes the other middlewares,
                //so if there is no exception, simple move the http request on to the "next" middleware

                //if there is an exception, catch it:
            }
            catch(Exception ex)
            {
                //first of all, log what happened to a console:
                _logger.LogError(ex, ex.Message);


                //now, we will form the http response to be returned carrying the exception, exception stack trace:
                //determine the httpresponse shape as a json file:
                httpcontext.Response.ContentType = "application/json";
                //determine and fill in the httpresponse error code as 500 (server error)
                httpcontext.Response.StatusCode = (int)HttpStatusCode .InternalServerError; //=500   
                //now determine in what mode we are: 
                //if we are in the development mode, so return an instance of the Errors\ApiException class while passing to it the status code, exception, exception stack trace (those are useful during development process)
                //if we are in the production mode, so return an instance of the Errors\ApiException class while passing to it the status code only !
                /*in the production mode, we will instantiate the ApiException class while passing the status code to it only, this means the message attrbiutes will be null, so that the default message will be returned:
                "Errors are the path to the dark side. Errors lead to anger. Anger leads to hate. Hate leads to carrier change"
                in the development mode, we instantiate the ApException class while passing the code, and setting the message attributes to ex.message and the details attribute to ex.stacktrace
                please review the ApiException class (which inherits the ApiResponse class !)*/
                //we will use a new if statmente here, which is  xxxxx ? yyyyy : zzzzzz (validate if xxxxx is true, if so, do yyyy, if not, do zzzzzz)
                var response = _env.IsDevelopment() ? new ApiException((int)HttpStatusCode .InternalServerError, ex.Message, ex.StackTrace.ToString()) : new ApiException((int)HttpStatusCode .InternalServerError);
                //now let us shape how the names in the json file are formatted,
                //we have 3 styles on how to write names ("Pascal/Microsoft", "Java" (camelCase) and "C" (underscores, snake_case)) -- as well as at least one more, kebab-case like longer-name).
                //this json by default will be returned with the Pascal case, let us change that to be camelCase like the responses we get from the ProductController for example
                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                //now, before we return the json file, we should serialize it, while passin the previous option created:
                var serializedJson = JsonSerializer.Serialize(response, options);
                //now retrun it inside the above created httpcontext res:
                await httpcontext.Response.WriteAsync(serializedJson);
            }

            //now go to the startup file and use it as we said above at the begining of this class
        }


    }
}