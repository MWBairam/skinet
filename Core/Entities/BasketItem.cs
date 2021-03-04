namespace Core.Entities
{
    public class BasketItem
    {
        //1-properties:
        //we can write above each property the data annotation [Requiered]
        //or any other Data Annotation we want like [MacLenght()] or  ......
        //but for the BasketItem model, we will do that on the Dto class level in API project, in Dtos folder for BasketItemDto  
        //that is to avoid using libraries as dependencies in Core project !
        
        public int Id { get; set; }  //Basket item Id
        public string ProductName { get; set; }  //we do not need also the Product Id ?
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string PictureUrl { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
    }
}