using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    /*
    we want to enhance the solution performance.
    we will not optimize DB queries, enhance the DB speed or .....
    we will cach responses in redis (key-value datastore) (which we already used before to store baskets).

    we created for that an interface with its implementation (service) IResponseCacheService/ResponseCacheService
    in core project, Interfaces folder and Infrastructue project, services folder.
    and registered IResponseCacheService/ResponseCacheService in startup file or ApplicationServicesExtension as a singletone service.

    what is this class ?
    in C# asp.net we have what is called attributes, 
    like the [Authorize] which we used above few methods in AccountController so that logged in users can call that method,
    or like the [HttpGet] attribute which we used in all controllers above few methods to mark it as an https get method,
    and .......

    we need to create an attribute so we can use the ResponseCachService to cach (store in redis) methods' responses,
    so when next time a user requests the same response, the controller will not bring it from DB,
    and this attribut will bring it from redis.

    so we will create an atribute [Cached(time_in_seconds)] to use it above methods in controllers.
    for example, in ProductsController, above GetProducts HttpGet method, we will write: [Cached(600)] which means
    cache (store in redis) this method response for 600 seconds.
    so that next time the user requests that response, the controller will not bring the response from DB,
    but this class will bring the response from the cached one in redis.

    As any good solution, there is a drawback for this.
    storing a lot of responses in redis will consume more from RAM memory.
    also storing responses for long time in redis is not good because you meay update something in DB, but users are still
    getting the old responses cached in redis and they have to wait until those cached responses are expired.  
    */

    //[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class CachedAttribute : Attribute, IAsyncActionFilter
    {
        /*
        -This class inherits the microsoft "Attribute" class, which allows this class to be an attribute as explained above.
        -And this class also implements the IAsyncActionFilter interface, which we bring from it the method:
        OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) 
        which allows us to intercept https requests ('context' parameter) and check if its response is in redis,
        and if yes, bring it from there, and if no, just forward this request to the relevant controller ('next' parameter).
        */



        //1-properties:
        private readonly int _timeToLiveSeconds;
        /*
        this attribute is how long to keep the response cached in redis, considered in seconds.
        remember above we said that we will use this class as [Cached(600)] above the https get methods in controllers.
        writting that attribute will create an instance of this class while passing the number of seconds (600)
        to this constructor below to initialize this property's value.
        */


        //2-Constructor:
        //initialize the above property value in it.
        public CachedAttribute(int timeToLiveSeconds)
        {
            _timeToLiveSeconds = timeToLiveSeconds;
        }


        //3-Methods:
        //This method is the implementation of the above interface IAsyncActionFilter.
        //this method's main functionality is explained above.
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //use the IResponseCachService we designed after intercepting each Http request ('context').
            //we cannot use the dependency injection for the IResponseCacheService, and we need to use it as below only to say that we are intercepting https requests.
            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();

            /*
            -redis does not generate a unique "key" for each "key-value pair", 
            and we need to generate that "key" before saving the "pair" in redis.

            -what is the "value" we are storing in redis ?
            it is the https response we want to cache in redis.
            and we should give it a "key", that is correlated out of the relevant sent https request.
            so that next time the user sends the same https request, this method will correlat the request data,
            and reconstruct the key, and search for it in redis, and bring the value associated with this value.
            
            and in order to generate the appropriate "key" for that functionality, we defined a method below called
            GenerateCacheKeyFromRequest and we pass to it the intercepted https request.
            Please read the nots in this method.
            */
            var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);

            //before caching this response with its key in redis, check that it is not cached before in redis:
            var cachedResponse = await cacheService.GetCachedResponseAsync(cacheKey);
            //and if it is cached and existed in redis:
            if (!string.IsNullOrEmpty(cachedResponse))
            {
                //return this cachedResponse from redis to the user without going to the Conroller and DB: 
                var contentResult = new ContentResult
                {
                    //the content of the cached json file is the 
                    Content = cachedResponse,
                    ContentType = "application/json",
                    StatusCode = 200
                };
                context.Result = contentResult;

                return;
            }
            //and if it is not already cached in redis, so move the https request to the controller to bring its response froom the DB:
            var executedContext = await next(); // move to controller
            //then cache this response in redis for the next times:
            if (executedContext.Result is OkObjectResult okObjectResult)
            {
                await cacheService.CacheResponseAsync(cacheKey, okObjectResult.Value, TimeSpan.FromSeconds(_timeToLiveSeconds));
            }
        }

        private static string GenerateCacheKeyFromRequest(HttpRequest request)
        {
            /*
            -redis does not generate a unique "key" for each "key-value pair", 
            and we need to generate that "key" before saving the "pair" in redis.

            -what is the "value" we are storing in redis ?
            it is the https response we want to cache in redis.
            and we should give it a "key", that is correlated out of the relevant sent https request.
            so that next time the user sends the same https request, this method will correlat the request data,
            and reconstruct the key, and search for it in redis, and bring the value associated with this value.
            
            and in order to generate the appropriate "key" for that functionality, we defined this method called
            GenerateCacheKeyFromRequest and we pass to it the intercepted https request from the above method.
            */

            //take an instance of stringBuilder class:
            var mykey = new StringBuilder();

            //use the .Append from the stringBuilder class to attach the https request path as the first part of the key.
            mykey.Append($"{request.Path}");
            //so for example if the intercepted https request is https://localhost:5001/api/products?typeId=3&brandId=2&sort=priceDesc
            //the mykey at this point will be : "/api/products"

            //now we should embed the other parts in the key,
            //the other parts in the intercepted https get request in the above example are "typeId=3&brandId=2&sort=priceDesc"
            //those are considered a querable array of a small key-value pairs:
            //[{typeId, 3}, {brandId, 2}, {sort, priceDesc}]
            //so we will loop over those and append them to mykey: 
            foreach (var (key, value) in request.Query.OrderBy(x => x.Key))
            {
                mykey.Append($"|{key}-{value}");
            }
            //the mykey at this point will be : "/api/products|typeId-3|brandId-2|sort-priceDesc"

            //now return this mykey to be used in redis:
            return mykey.ToString();
        }
    }
}