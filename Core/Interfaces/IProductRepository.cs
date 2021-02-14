//this interface is not used anymore since we are using the IgenericRepository interface and its GenericRepository Implementation


// using System.Collections.Generic;
// using System.Threading.Tasks;
// using Core.Entities;

// namespace Core.Interfaces
// {
//     public interface IProductRepository
//     {
//          Task<IReadOnlyList<Product>> GetProductsAsync();
//          Task<Product> GetProductByIdAsync(int id);

//          //we added the async keyword to the signatures names just to clarify how we are getting the data
//          //we can add the "Public" modifier at the begininng
//          //in the next signature, we it is better to say read only list other than list, so we protect the reurned list from modifications

//          //Implementation of these signatures are in the Data folder,IProductRepostitory in the Infrastructure code



//          //let us as well use this interface to get a list of ProductBrands and ProductTypes:
//          Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync();
//          Task<IReadOnlyList<ProductType>> GetProductTypesAsync();
//     }
// }