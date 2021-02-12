using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //with the above route, we will be calling the api as https://localhost:5001/api/products where products is the controller name
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repo;
        public ProductsController(IProductRepository repo)
        {
            _repo = repo;

        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return Ok(await _repo.GetProductsAsync());
            //we cannot write: return await _repo.GetProductsAsync() because GetProductsAsync() return IReadOnly list, and here return ActionResult
        }

        //the id in the HttpGet because we have 2 HttpGet methods in this api, so the controller is not confused about what get should be useing when called !
        //sice we have 2 API Get functions, use in the terminal ">dotnet watch run" in order to run and test in postman, otherwise,
        //if you used ">dotnet run" and tried to test in postman, you will receive an unhandled exeption sayin conflict with 2 Get methods
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            return await _repo.GetProductByIdAsync(id);
        }





        //let us bring the Brands and Types from the same Repository we used:
        //add a route for this Get as "brands" so we can call it using https://localhost:5001/api/products/brands :
        [HttpGet("brands")]
        public async Task<ActionResult<List<ProductBrand>>> getBrands()
        {
            return Ok(await _repo.GetProductBrandsAsync());
        }

        //add a route for this Get as "types" https://localhost:5001/api/products/types :
        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> getTypes()
        {
            return Ok(await _repo.GetProductTypesAsync());
        }
    }
}