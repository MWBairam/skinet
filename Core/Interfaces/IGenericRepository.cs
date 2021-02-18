//we notice that all interfaces have signatures (functions) of: to bring a list of a DB table, to bring a row from a DB table 
//for example, IProductRepository, has one one function to bring a product by Id, 3 functions to bring a list of Products, ProductTypes, ProductBrands
//all the other interfaces are like this

//so here we will write 2 functions, GetById, and ListAll, and each of these accepts a Generic type, which is any Entity type
//so we will write GetById<T>(int Id), T is called a type or a template, which is a place holder for an entity
//if we want to get a product by Id, we call (in specific places) the below generic function as GetById<Product>(int Id)

//besides the IGenericRepository, we write the <T> so this repo becomes Generic and its functions accept to be called for any Entity, e.g Product
//to constrain this Generic repo to our Entities in Core project Entites\ folder, we write "where T : BaseEntity"
//like this way, this Generic repo can be used for the Entities derives (inherits)the BaseEntity only 
//and this is what we said in the note in the BaseEntity class

//after writing the signatures (fuctions) here, Implement them in Infrastructure project Data\GenereicRepository (write the functions body)

//after that, register the IGenericRepository (interface) and GenericRepository (implementation) in the startup.cs file of the startup project API



using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        //let us write 2 signatures (functions) as we explained above
        //those returns a Task of a template <T>, this T could be the Product entity or productType Entity or .......
        //we can write public before of each of them, or no
        Task<T> GetByIdAsync(int Id);
        Task<IReadOnlyList<T>> ListAllAsync();



        //now also let me write 2 signatures (functions) 
        //but those are different, and will be used mainly for the Product entity
        //since we want to return the list of Products (or Product by Id) with .Include(p => ProductType).Include(ProductBrand) 
        //those functions use the ISpecification interface we created in the Core project and its implementation there.
        Task<T> GetEnityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        //we can call them GetByIdAsyncWithSpec  and  ListAllAsyncWithSpec
        //but just let us stick with the lecturer names




        //this is related to the Pagination class in the Helper folder:
        Task<int> CountAsync(ISpecification<T> spec);


    }
}