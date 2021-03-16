using System.Collections.Generic;

namespace Core.Entities
{
    public class CustomerBasket
    {


        //1-)properties:
        //we can write above each property the data annotation [Requiered]
        //or any other Data Annotation we want like [MaxLenght()] or  ......
        //but for the CustomerBasket model, we will do that on the Dto class level in API project, in Dtos folder for CustomerBasketDto
        //that is to avoid using libraries as dependencies in Core project !
        public string Id { get; set; }  //since we are using Redis to store Basket items, we will keep the Id as a string there, which will be generated from the angular side, not by redis !
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        //Another set of properties were added in video 260, 262 to support the checkout (in particular, the payment tab) process:
        //int? means it is optional and can be null. strings are by default nullable.
        //So those are optional during basket creation (will be empty) and will get set to a vlue when the user do the payment.
        //remember the PaymentSevice in ifrastructure project in Services folder.
        public int? DeliveryMethodId {get; set;}
        public string ClientSecret {get; set;}
        public string PaymentIntentId {get; set;}
        //and according to this, we need to update the CustomerBasketDto in Dtos folder and the IBasket in the client side in shared/models
        
        


        //the following has been added in the video 264 to persist showing the value of shipping price of a delivery method
        //in the order-total.component.html  which reads the basket.
        //added in client app shared/models/basket.ts IBasket, and CustomerBasket in core project/Entities and CustomerBasketDto in the API project 
        public decimal? shippingPrice {get; set;}


        
        //2-)Constructor:
        //constructor with Id parameter:
        //usefull when we instantiate the CustomerBasket class.
        //we we need to set the Id manually through the constructor ?
        //we will store the basket in redis as json file, and of course redis will not generate an Id (key) for each json file.
        //we will generate an Id in the angular frontend side using uuid method, and send it to the BasketController which creates a CustomerBAsket instance whie passing the id to here
        public CustomerBasket(string _Id)
        {
            //this sets the above Id property to the passed _Id 
            Id = _Id;
        }
        //parameter less constructor:
        //needed for the EntityFramwork job.
        public CustomerBasket()
        {
        }


        //we need, once a basket needs to be created, to initialize the above 2 properties,
        //so, the list is initialized as an empty list using = new List<BasketItem>();
        //and if we need to initialize the Id, we call the constructor with the parameter _Id

        //the redis will instantiate a CustomerBasket without passing any data,
        //so create the parameter-less constructor for that !








    }
}