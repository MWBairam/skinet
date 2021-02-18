using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {



        private readonly StoreContext _Context;
        public GenericRepository(StoreContext Context)
        {
            _Context = Context;
        }







        public async Task<T> GetByIdAsync(int id)
        {
            return await _Context.Set<T>().FindAsync(id);
            //Set<T>() will be replaced by the Entity we are using in the generic interface, it can be Product, ProductType, .....
        }

        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
            return await _Context.Set<T>().ToListAsync();
        }








        public async Task<T> GetEnityWithSpec(ISpecification<T> ISpecification)
        {
            //we are using here the GetQuery function in the SpecificationEvaluation class
            //this return something like  .where(p => p.Id == id).Include(p => ProductType).Include(ProductBrand) 
            //to call it, we pass to it, our DBContext table a linq AsQueryable table, with the ISpecification (which has Criteria, Includes needed)
            return await SpecificationEvaluator<T>.GetQuery(_Context.Set<T>().AsQueryable(), ISpecification).FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> ISpecification)
        {
            //we are using here the GetQuery function in the SpecificationEvaluation class
            //this return something like  .where(p => p.Id == id).Include(p => ProductType).Include(ProductBrand) 
            //to call it, we pass to it, our DBContext table a linq AsQueryable table, with the ISpecification (which has Criteria, Includes needed)
            return await SpecificationEvaluator<T>.GetQuery(_Context.Set<T>().AsQueryable(), ISpecification).ToListAsync();
        }






        //this is related to the Pagination class in the Helper folder:
        public async Task<int> CountAsync(ISpecification<T> ISpecification)
        {
            //count the number of result returned (using microsoft .CountAsync() function) (our function name is also CountAsync())
            return await SpecificationEvaluator<T>.GetQuery(_Context.Set<T>().AsQueryable(), ISpecification).CountAsync();
        }
    }
}