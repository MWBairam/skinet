using System;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {

        //1-properties:
        private readonly IDatabase _redisDatabase;

        //2-constructor:
        //inject the Redis ConnectionMultiplexer (the same wya we used to inject our DB context when we wanted to talk to sql db):
        public BasketRepository(IConnectionMultiplexer redis)
        {
            _redisDatabase = redis.GetDatabase();  //redis,  which stores data as strings and json files 
        }

        //methods:
        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            //data are stored as strings in json files in the redis DB, so bring the requiered basket based on its Id using .StringGetAsync
            var data = await _redisDatabase.StringGetAsync(basketId);
            //then we need to extract the data from the json file, and return it as an object of the "CustomerBasket" entity,
            //so use the deserialize function for that while passing to it the serialized json file
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
            //what we used up is another shape of "if" statment, so ? means if, and return null if the "data" is not existed or empty, : means else, return ....
        }
        //there is not "CreateBasketAsync" method, becuase creation will be be done as well by the Update method
        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            //we are going to pass to it an object of CustomerBasket entity,
            //and since redis stores data as strings and jsons, we need to srialize the object we passed,
            //then add it using the StringSetAsync,
            //we passed to it the Id, since the Id is stored in the CustomerBasket entity object, and created by the client angular side, not by redis !
            //and we gave it a lifetime of 30 days, so the user basket wil be deleted after 30 days ! 
            var created = await _redisDatabase.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), TimeSpan.FromDays(30));
            //the StringSetAsync overwrites the existed data of a basket with a specific Id if that basket is existed, and return true
            //otherwise (basket of a basket Id is not existed), creates the baskt, and returns false !

            //in the second case, returns null, and in the first one, returns the updated basket using the above identified GetBasketAsync method !
            return !created ? null :  await GetBasketAsync(basket.Id);
        }
        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            //KeyDeleteAsync returns true once the basket is deleted !
            return await _redisDatabase.KeyDeleteAsync(basketId);
        }




    }
}