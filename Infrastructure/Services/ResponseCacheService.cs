using System;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services
{
    //we want to enhance the solution performance.
    //we will not optimize DB queries, enhance the DB speed or .....
    //we will cach responses in redis (key-value datastore) (which we already used before to store baskets) 

    //then this is used in API project, Helper folder, CachedAttribute.cs


    //implement the IResponseCacheService interface.
    //(register IResponseCacheService/ResponseCacheService in startup file or ApplicationServicesExtension as a singletone service )
    public class ResponseCacheService : IResponseCacheService
    {
        //1-properties:
        private readonly IDatabase _redisDatabase;

        //2-Constructor:
        //inject the Redis IConnectionMultiplexer.
        //remember the same way, when we wanted to talk to an SQL DB, we injected a DBContext.
        //here we inject IConnectionMultiplexer interface in ordrer to talk to redis.
        //Usually we write the DBContext as we did in StoreContext. But IConnectionMultiplexer is readywithout any modificcation from StackExchange.Redis library.         
        //and we remember that we added a service for this in startuyp.cs file just like how we did that for sql as well.        
        public ResponseCacheService(IConnectionMultiplexer redis)
        {
            _redisDatabase = redis.GetDatabase();
        }

        //3-methods:
        //a-cach an api response in redis with a key and specify how long it can live there 
        public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
        {
            if (response == null)
            {
                return;
            }

            //we will store (cach) an API response in redis as json file (serialized file),
            //but before we create this josn, we will specify one option that we need to have to keep consistency of what is usually returned from an API,
            //let us shape how the names in the json file are formatted,
            //we have 3 styles on how to write names ("Pascal/Microsoft", "Java" (camelCase) and "C" (underscores, snake_case)) -- as well as at least one more, kebab-case like longer-name).
            //this json by default will be returned with the Pascal case, let us change that to be camelCase like the responses we get from the ProductController for example
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            
            //now use that option while serializing the response we want to store in redis:
            var serialisedResponse = JsonSerializer.Serialize(response, options);
             
            //now save it in redis with giving it a key=cacheKey (we pass it to this method) and specifying how long it should live in redis:
            await _redisDatabase.StringSetAsync(cacheKey, serialisedResponse, timeToLive);
        }

        //b-get that cached response from redis by its key:
        public async Task<string> GetCachedResponseAsync(string cacheKey)
        {
            //get a json file from redis by its key (get a cached response by its key)
            var cachedResponse = await _redisDatabase.StringGetAsync(cacheKey);

            if (cachedResponse.IsNullOrEmpty)
            {
                return null;
            }

            return cachedResponse;
        }
    }
}