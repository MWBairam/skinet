namespace Core.Entities
{
    public class Product : BaseEntity
    {
        //we can write above each property the data annotation [Requiered]
        //or any other Data Annotation we want like [MacLenght()] or  ......
        //but for the Product model, we will do that on the DB level in Infrastructur project, in Data/config folder


        //"Id" attribute is inherited from the BaseEntity class

        public string Name { get; set; }  //we can write above each property the data annotation [Requiered]
        public string Description {get; set;}
        public decimal Price {get; set;}
        public string PictureUrl {get; set;}

        //these two lines are: 1-the relation with the ProductType table (ProductType is the parent, Product is the son) 2-foreign key
        //shouldn't I be using the "virtual" keyword besides ProductType? no need here, we used (in Infrastructur project) the file config\ProductConfiguration to complete the relations
        //also, in the ProductRepository, we will make a benefit out of this to return ProductType{name, Id} of each product in what is called Eager loading (not lazy loading - lazy loading is when quering the a single ProductType to return with it all associated Products)
        public ProductType ProductType {get; set;}  
        public int ProductTypeId {get; set;}

        //these two lines are: 1-the relation with the ProductBrand table (ProductBrand is the parent, Product is the son) 2-foreign key
        //shouldn't I be using the "virtual" keyword besides ProductBrand? no need here, we used (in Infrastructur project) the file config\ProductConfiguration to complete the relations
        //also, in the ProductRepository, we will make a benefit out of this to return ProductBrand{name, Id} of each product in what is called Eager loading (not lazy loading - lazy loading is when quering the a single ProductBrand to return with it all associated Products)
        public ProductBrand ProductBrand {get; set;} 
        public int ProductBrandId {get; set;}
    }
}