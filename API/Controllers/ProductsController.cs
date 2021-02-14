using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using System.Linq;
using AutoMapper;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //with the above route, we will be calling the api as https://localhost:5001/api/products where products is the controller name
    public class ProductsController : ControllerBase
    {


        //the following is the old constructor when we used IProductRepository interface: 
        //private readonly IProductRepository _repo;
        //public ProductsController(IProductRepository repo)
        //{
        //    _repo = repo;
        //}
        //now below is the new constructor when we use the IGenericRepository Interface:
        //inject in it 3 IGenericRepository instances each one for a specific type of Entity:
        //then in the HttpGet funtions, you will be calling the GetByIdAsync() and ListAllAsync() functions which written in the IGenericRepository (interface) Generic Repository (implementation)
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IMapper _mapper; //the mapper will be used when returning Dtos
        public ProductsController(IGenericRepository<Product> productsRepo, IGenericRepository<ProductType> productTypeRepo, IGenericRepository<ProductBrand> productBrandRepo, IMapper mapper)
        {
            _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo;
            _productsRepo = productsRepo;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts()
        {
            //if we used ListAllAsync() function from the IGenericRepository:
            //return Ok(await _productsRepo.ListAllAsync());
            //it does not return the ProductType{Id, name} and ProductBrand{Id, name} of each product when quering the Products
            //so use the another function ListAsync while passing to it the class ProductsWithTypesAndBrandsSpecification in the Core project where our Includes should be added once the constructor of that class is called:
            //   return Ok(await _productsRepo.ListAsync(new ProductsWithTypesAndBrandsSpecification() ));

            //now, we do not want to return all the attributes in the Core Project -> Entities folder -> Product class
            //we want to return the ones in the Dtos folder -> ProductToReturnDto only:
            var products = await _productsRepo.ListAsync(new ProductsWithTypesAndBrandsSpecification());
            // return products.Select(product => new ProductToReturnDto
            // {
            //     Id = product.Id,
            //     Name = product.Name,
            //     Description = product.Description,
            //     PictureUrl = product.PictureUrl,
            //     Price = product.Price,
            //     ProductBrand = product.ProductBrand.name,
            //     ProductType = product.ProductType.name
            // }).ToList();
            //select() does project each element of a sequence into a new form

            //instead of doing the previous mapping manually, we will do it using the auto mapper:
            //we injected the Imapper interface (microsoft already defined interface) in the constructor:
            return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
            //and change the return type above from Task<ActionResult<Product>> to Task<ActionResult<ProductToReturnDto>>
        }

        //the id in the HttpGet because we have 2 HttpGet methods in this api, so the controller is not confused about what get should be useing when called !
        //sice we have 2 API Get functions, use in the terminal ">dotnet watch run" in order to run and test in postman, otherwise,
        //if you used ">dotnet run" and tried to test in postman, you will receive an unhandled exeption sayin conflict with 2 Get methods
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            //if we used GetById() function from the IGenericRepository:
            //return await _productsRepo.GetById();
            //it does not return the ProductType{Id, name} and ProductBrand{Id, name} of each product when quering the Product
            //so use the another function GetEnityWithSpec while passing to it the class ProductsWithTypesAndBrandsSpecification in the Core project where our Includes should be added once the constructor of that class is called:
            //instantiate an instance of the ProductsWithTypesAndBrandsSpecification class whiel passing the id to its constructor
            //like this way, the parameter-less constructor of the ProductsWithTypesAndBrandsSpecification will not be used,
            //and instead, the constructor with id parameter will be used, which also inherits the BaseSpecification constructor while passing to it the expression x => x.Id == id
            //  return await _productsRepo.GetEnityWithSpec(new ProductsWithTypesAndBrandsSpecification(id));

            //now, we do not want to return all the attributes in the Core Project -> Entities folder -> Product class
            //we want to return the ones in the Dtos folder -> ProductToReturnDto only:
            var product = await _productsRepo.GetEnityWithSpec(new ProductsWithTypesAndBrandsSpecification(id));
            // return new ProductToReturnDto
            // {
            //     Id = product.Id,
            //     Name = product.Name,
            //     Description = product.Description,
            //     PictureUrl = product.PictureUrl,
            //     Price = product.Price,
            //     ProductBrand = product.ProductBrand.name,
            //     ProductType = product.ProductType.name
            // };
            //instead of doing the previous mapping manually, we will do it using the auto mapper:
            //we injected the Imapper interface (microsoft already defined interface) in the constructor:
            return _mapper.Map<Product, ProductToReturnDto>(product);
            //and change the return type above from Task<ActionResult<Product>> to Task<ActionResult<ProductToReturnDto>>

        }








        //let us bring the Brands and Types from the same Repository we used:
        //add a route for this Get as "brands" so we can call it using https://localhost:5001/api/products/brands :
        [HttpGet("brands")]
        public async Task<ActionResult<List<ProductBrand>>> getBrands()
        {
            return Ok(await _productBrandRepo.ListAllAsync());
        }

        //add a route for this Get as "types" https://localhost:5001/api/products/types :
        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> getTypes()
        {
            return Ok(await _productTypeRepo.ListAllAsync());
        }
    }
}