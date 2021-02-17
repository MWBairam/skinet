using System.Linq;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    //also write the <T> to make this class Generic for differnt Entities classes.
    //to constrain this Evaluator to our Entities in Core project Entites\ folder, we write "where T : BaseEntity"
    public class SpecificationEvaluator<T> where T : BaseEntity 
    {
        //create a static function. static means the function can be accessed without creating an instance of this class.
        //our main goal here is implement the full string of queries we want, such as, considering the Product Entity will be instead of <T>:
        // .where(p => p.Id == id).Include(p => ProductType).Include(ProductBrand) 
        //on the DbContext table will pass to the inputQuery parameter
        //where this where Criteria and these Includes come from the attributes in ISpecification interface (get and set them from the BaseSpecification Implementation class) in the core project
        //this functions uses 2 parameters, their types are services (Interfaces):
        //1-the first one is an interface already defined by microsoft, IQuerable. 
        //we will pass to the inputquery (in the GenericRepository class which implements the IGenericRepository interface) a DBContext table as a queryable linq table, such as Products table
        //2-the second one is the ISpecification interface, we defined in it the Criteria and the Includs list
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> ISpecification)
        {
            //we will cosider first the out final result (query var) is exactly the entire table:
            var query = inputQuery;
            //then will check the criteria if existed, such as .where(p => p.Id == ) and query according to it
            if (ISpecification.Criteria != null)
            {
                query = query.Where(ISpecification.Criteria);
            }


            //this part is added for Sorting operations:
            if(ISpecification.OrderBy != null)
            {
                query = query.OrderBy(ISpecification.OrderBy);
            }
            if(ISpecification.OrderByDescending != null)
            {
                query = query.OrderByDescending(ISpecification.OrderByDescending);
            }



            //at last, aggregate the previously created .where with .Includes we want 
            query = ISpecification.Includes.Aggregate(      query    ,      (current, include) => current.Include(include)            );
            //example of the last result:
            // _Context.Products.where(p => p.Id == id).Include(p => ProductType).Include(ProductBrand)
            //supposing that we passed _Context.Products to inputquery when we called this function in the GenericRepository functions
            
            return query;
        }
    }
}