//this interface implementation is not used anymore since we are using the IgenericRepository interface and its GenericRepository Implementation

// using System.Collections.Generic;
// using System.Threading.Tasks;
// using Core.Entities;
// using Core.Interfaces;
// using Microsoft.EntityFrameworkCore;

// namespace Infrastructure.Data
// {
//     public class ProductRepository : IProductRepository
//     {
//         private readonly StoreContext _Context;
//         public ProductRepository(StoreContext Context)
//         {
//             _Context = Context;
//         }

//         public async Task<IReadOnlyList<Product>> GetProductsAsync()
//         {
//             //return await _Context.Products.ToListAsync();
//             //instead of above, perform the following to return ProductType{name, Id} and ProductBrand{name, Id} of each product in what is called Eager loading
//             return await _Context.Products.Include(p => p.ProductType).Include(p => p.ProductBrand).ToListAsync();
//         }

//         public async Task<Product> GetProductByIdAsync(int id)
//         {
//             //return await _Context.Products.FindAsync(id);
//             //instead of above, perform the following to return ProductType{name, Id} and ProductBrand{name, Id} of each product in what is called Eager loading
//             return await _Context.Products.Include(p => p.ProductType).Include(p => p.ProductBrand).FirstOrDefaultAsync(p => p.Id == id);
//         }




//         public async Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync()
//         {
//             return await _Context.ProductBrands.ToListAsync();
//         }

//         public async Task<IReadOnlyList<ProductType>> GetProductTypesAsync()
//         {
//             return await _Context.ProductTypes.ToListAsync();
//         }
//     }
// }