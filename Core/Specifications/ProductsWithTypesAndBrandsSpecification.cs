using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {

        // //parameter less constructor 
        // public ProductsWithTypesAndBrandsSpecification(string sort)
        // {
        //     //use the AddInclude function in the BaseSpecification class to add the following 2 lambda expressions in the "Includes" list of expressions
        //     AddInclude(x => x.ProductType);
        //     AddInclude(x => x.ProductBrand);
        // }


        //re-write the above parameter-less constructor to be a constructor with parameters when for adding the sorting functionality and filtering:
        //the int? means that the int can be null and it is completely optional to pass avalue to it or no !
        //that because we may filter based on brand only or type only or both of them !
        //make the constructor with the :base() which means use also the derived (inherited) BaseSpecification class constructor
        //the BaseSpecification class constructor, if you take a look, has one parameter which sets the BaseSpecification "Criteria" attribute
        //the "Criteria" attribute was mainly built to have an expression such as x => x.Id when quering a specific product for example in the second constructor at the end of this file below
        //but since it is goingto be constructed in a .Where() lambda expression in the SpecificationEvaluator in Infrastructure project Data folder,
        //so we can use it as well to write an expression like: x => x.brandId and x => x.typeId or any one of these expressions alone
        //so do that in the :base() part to pass the criteria we want.
        //and for search part as well.
        //instead of:
        //public ProductsWithTypesAndBrandsSpecification(string sort, int? brandId, int? typeId, .....)
        //:base (x => (!brandId.HasValue || x.ProductBrandId == brandId) && (!typeId.HasValue || x.ProductTypeId == typeId))
        //we created a class ProductSpecParams where we store the parameters related to GetProducts() function in the ProductController
        //so use it here:
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams ProductParams)
        :base (x => (string.IsNullOrEmpty(ProductParams.Search) || x.Name.ToLower().Contains(ProductParams.Search)) 
                 && (!ProductParams.TypeId.HasValue || x.ProductTypeId == ProductParams.TypeId)  //it means, if the typeId has a value, example TypeId=2, the !HasValue returns false, so implement what is on the left of "elsewhere ||" (easier way other than using if)
                 && (!ProductParams.BrandId.HasValue || x.ProductBrandId == ProductParams.BrandId) )
        {
            //use the AddInclude function in the BaseSpecification class to add the following 2 lambda expressions in the "Includes" list of expressions
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);



            //this is added to apply the sorting functionality
            //besides the above parameter string sort
            AddOrderBy(x => x.Name);
            if(!string.IsNullOrEmpty(ProductParams.sort))
            {
                switch(ProductParams.sort)
                {
                    case "priceAsc": AddOrderBy(x => x.Price);
                    break;
                    case "priceDesc": AddOrderByDescending(x => x.Price);
                    break;
                    case "nameDesc": AddOrderByDescending(x => x.Name);
                    break;
                    default : AddOrderBy(x => x.Name);
                    break;
                }
            }


            //this is added to paginate the Products returned into pages (6 Products per page for example)
            ApplyPaging(   ProductParams.PageSize * (ProductParams.PageIndex -1)  , ProductParams.PageSize);
            //remember that ApplyPaging(skip, take) is in BaseSpecification class (ISpecification interface implementation)
            //the -1 is requiered for the case of PageIndex = 1,
            //if it was not exxisted, we will have skip=5 and take=5 so we will get nothing !
            //with -1, and PageIndex=1, we will skip=0 and take=5

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