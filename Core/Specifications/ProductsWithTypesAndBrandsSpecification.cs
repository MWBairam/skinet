using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {

        //parameter less constructor:
        public ProductsWithTypesAndBrandsSpecification()
        {
            //use the AddInclude function in the BaseSpecification class to add the following 2 lambda expressions in the "Includes" list of expressions
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }






       //constructor with parameters:
       //here we inherits the constructore of the BaseSpecification class through out the :base
       //the constructore of the BaseSpecification class accepts one parameter which is an "Expression<Func<T, bool>>"
       //so we will pass to it the expression x => x.Id == id
       //id is the parameter in the ProductsWithTypesAndBrandsSpecification(int id) and we will pass to it the Product Id we want
       public ProductsWithTypesAndBrandsSpecification(int id) : base (x => x.Id == id )
       {
           //also prepare the Includes again:
           //use the AddInclude function in the BaseSpecification class to add the following 2 lambda expressions in the "Includes" list of expressions
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
       }
    }
}