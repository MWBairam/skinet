using Core.Entities;

namespace Core.Specifications
{

    //this class is continuing the spcifications in ProductsWithTypesAndBrandsSpecification

    //make the constructor with the :base() which means use also the derived (inherited) BaseSpecification class constructor
    //the BaseSpecification class constructor, if you take a look, has one parameter which sets the BaseSpecification "Criteria" attribute
    //the "Criteria" attribute was mainly built to have an expression such as x => x.Id when quering a specific product for example in the second constructor at the end of this file below
    //but since it is goingto be constructed in a .Where() lambda expression in the SpecificationEvaluator in Infrastructure project Data folder,
    //so we can use it as well to write an expression like: x => x.brandId and x => x.typeId or any one of these expressions alone
    
    //instead of:
    //public ProductsWithTypesAndBrandsSpecification(string sort, int? brandId, int? typeId, .....)
    //:base (x => (!brandId.HasValue || x.ProductBrandId == brandId) && (!typeId.HasValue || x.ProductTypeId == typeId))
    //we created a class ProductSpecParams where we store the parameters related to GetProducts() function in the ProductController
    //so use it here:
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        //the following is enough to count the number of products of a specific barnd/type
        public ProductWithFiltersForCountSpecification(ProductSpecParams ProductParams) 
        :base (x => (string.IsNullOrEmpty(ProductParams.Search) || x.Name.ToLower().Contains(ProductParams.Search)) 
                 && (!ProductParams.TypeId.HasValue || x.ProductTypeId == ProductParams.TypeId)
                 && (!ProductParams.BrandId.HasValue || x.ProductBrandId == ProductParams.BrandId) )
        {
        }
    }
}