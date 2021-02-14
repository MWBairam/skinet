using Core.Entities;

namespace API.Dtos
{
    public class ProductToReturnDto
    {
        //we want to return these data to the API consuming part, not the ones in the Core Project -> Entities folder Product class
        public int Id {get; set;}
        public string Name { get; set; }
        public string Description {get; set;}
        public decimal Price {get; set;}
        public string PictureUrl {get; set;}
        public string ProductType {get; set;}  
        public string ProductBrand {get; set;} 

        //after that, in the ProductController functions, use these attributes to get returned
    }
}