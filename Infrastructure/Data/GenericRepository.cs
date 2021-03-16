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


        //1-properties:
        private readonly StoreContext _Context;

        //2-constructor:
        //inject the StoreContext:
        public GenericRepository(StoreContext Context)
        {
            _Context = Context;
        }






        //3-methods:
        
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





        //generic add/update/delete methods:
        //we used them for example in OrderService where we added orders:
        //we do not want them to be async methods, so that the app can track the change.
        public void Add(T entity)
        {
            _Context.Set<T>().Add(entity);
        }      
        public void Update(T entity)
        {
            _Context.Set<T>().Attach(entity);
            _Context.Entry(entity).State = EntityState.Modified;
        }
		public void Delete(T entity)
        {
            _Context.Set<T>().Remove(entity);
        }
        //commit changes to DB, and return the number of operations done !
        public async Task<int> Complete()
        {
            return await _Context.SaveChangesAsync();
        }

    }
}