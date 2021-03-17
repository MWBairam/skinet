using System;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    //we want to enhance the solution performance.
    //we will not optimize DB queries, enhance the DB speed or .....
    //we will cach responses in redis (key-value datastore) (which we already used before to store baskets) 
    public interface IResponseCacheService  //implement this interface in Infrastructure project, Entities folder
    {
        //2 methods, one to cach a response in redis with a key and specify how long it can live there 
        //the second method is to get that cached response from redis by its key 
         Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive);
         Task<string> GetCachedResponseAsync(string cacheKey);       
    }
}