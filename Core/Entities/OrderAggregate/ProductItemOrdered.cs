namespace Core.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
        /*
        you might ask that we have "Product" model ! besides that Product and this model are on the same context StoreContext, 
        so why we do not use it and associate those models together ?
 
        we just want to separate things apart.
        instead of creating sql relation between OrderItem model and Product, we will bring the items to be ordered from the basket (from Redis),
        and store each item in the below properties as an object in OrderItem model !
        */

        //1-properties:

        //we do not have an Id, because this "ProductItemOrdered" and "OrderItem" are not sql-relational DBs,
        //the ProductItemOrdered is going to be a property inside the OrderItem, implemnted as a column, directly existed in the same row ! 
        //and we will configure that in Data/config folder in OrderItemConfiguration for aggregating this object as a property in OrderItem model

        public int ProductItemId { get; set; } //this is not an sql Id, this will store the Id of the product to be ordered !
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }

         


        //2-constructor:
        //constructor with parameters so when we create an instance of this class, we can pass values to the constructor to set the above properties:
        public ProductItemOrdered()
        {
        }

        //since we got a constructor with parameters, we need to write the parameter-less constructor,
        //otherwise EntityFramework will complain and produce errors:
        public ProductItemOrdered(int productItemId, string productName, string pictureUrl)
        {
            ProductItemId = productItemId;
            ProductName = productName;
            PictureUrl = pictureUrl;
        }
    }
}