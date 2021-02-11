using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //with the above route, we will be calling the api as https://localhost:5001/api/products where products is the controller name
    public class ProductsController : ControllerBase
    {
        private readonly StoreContext _Context;
        public ProductsController(StoreContext Context)
        {
            _Context = Context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return await _Context.Products.ToListAsync();
        }

        //the id in the HttpGet because we have 2 HttpGet methods in this api, so the controller is not confused about what get should be useing when called !
        //sice we have 2 API Get functions, use in the terminal ">dotnet watch run" in order to run and test in postman, otherwise,
        //if you used ">dotnet run" and tried to test in postman, you will receive an unhandled exeption sayin conflict with 2 Get methods
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            return await _Context.Products.FindAsync(id);
        }
    }
}