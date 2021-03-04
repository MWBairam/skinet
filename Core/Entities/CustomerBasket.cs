using System.Collections.Generic;

namespace Core.Entities
{
    public class CustomerBasket
    {


        //1-properties:
        //we can write above each property the data annotation [Requiered]
        //or any other Data Annotation we want like [MacLenght()] or  ......
        //but for the CustomerBasket model, we will do that on the Dto class level in API project, in Dtos folder for CustomerBasketDto
        //that is to avoid using libraries as dependencies in Core project !
        
        public string Id { get; set; }  //since we are using Redis to store Basket items, we will keep the Id as a string there, which will be generated from the angular side, not by redis !
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();


        //2-Constructor:
        //parameter less constructor:
        public CustomerBasket()
        {
        }
        //constructor with Id parameter 
        public CustomerBasket(string _Id)
        {
            //this sets the above Id property to the passed _Id 
            Id = _Id;
        }


        //we need, once a basket needs to be created, to initialize the above 2 properties,
        //so, the list is initialized as an empty list using = new List<BasketItem>();
        //and if we need to initialize the Id, we call the constructor with the parameter _Id

        //the redis will instantiate a CustomerBasket without passing any data,
        //so create the parameter-less constructor for that !




    }
}