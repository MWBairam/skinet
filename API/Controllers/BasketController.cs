  
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController : ControllerBase
    {
        //we are storeing customers baskets in redis (not sql db)
        //we identified the redis connectionMultiplexer srting in startup.cs
        //we cerated IRedisRepository and RedisRepository service interface and implementation
        //here we will use it to communicate with the redis to Create\Read\Update\Delete baskets in redis
        //redis stores data as strings and jsons

        //1-properties
        private readonly IBasketRepository _basketRepository;

        //2-Constructor:
        //inject TBasketRepositoy we created:
        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }

        //3-methods:
        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            var basket = await _basketRepository.GetBasketAsync(id);

            return Ok(basket ?? new CustomerBasket(id));
            //return the var basket, and if:
            //?? means if null, so consider the user is without a basket, so instantiate a one for him (and display empty items in it)
            //then we the user add items to it, the basket will be created using the below Update method !
        }

        //there is not "CreateBasketAsync" method, becuase creation will be be done as well by the Update method
        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            var updatedBasket = await _basketRepository.UpdateBasketAsync(basket);

            return Ok(updatedBasket);
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id)
        {
            await _basketRepository.DeleteBasketAsync(id);
        }
    }
}