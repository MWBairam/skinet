namespace Core.Entities
{
    public class ProductBrand : BaseEntity
    {
        public string name {get; set;}

        //the lecturer did not create ICollection<Product> in this parent class !!
        //How the relation with the Product class will be completed ?
        //no need here, we used (in Infrastructur project) the file config\ProductConfiguration to complete the relations
    }
}