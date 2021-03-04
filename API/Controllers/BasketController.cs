  
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
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
        private readonly IMapper _mapper; //the mapper will be used when returning/receiving Dtos in the UpdatBasket method !

        //2-Constructor:
        //inject TBasketRepositoy we created:
        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            _basketRepository = basketRepository;
            _mapper = mapper;
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
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket)
        {
            //identify the received data from the client angular side as CustomerBasketDto, not the original model CustomerBasket !
            //indded, the CustomerBasketDto and CustomerBasket have the same properties, but in CustomerBasketDto we did validations using data annotations !
            
            //after the validation has been done, transfer back from Dto to the original model:
            var CustomerBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(basket);
            
            //then update:
            var updatedBasket = await _basketRepository.UpdateBasketAsync(CustomerBasket);

            return Ok(updatedBasket);
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id)
        {
            await _basketRepository.DeleteBasketAsync(id);
        }
    }
}