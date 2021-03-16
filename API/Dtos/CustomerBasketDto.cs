using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class CustomerBasketDto
    {
        //we could have done the below [Required] and [...] ... validations using Data Annotation in Core/Entities/Identity/CustomerBasket, 
        //but we choosed not to do it on Entity level, only on Dto level
        //indeed, the Dto properties here below are exactly as the model CustomerBasket in Core/Entities !
        //but the reason of using this Dto is we said above, we want to do validations using annotations here !
        //that is to avoid using libraries as dependencies in Core project !


        [Required]
        public string Id { get; set; }
        public List<BasketItemDto> Items { get; set; }


        //those were added in video 260, please read the note in Customerbasket model in core project, Entities folder.
        public int? DeliveryMethodId {get; set;}
        public string ClientSecret {get; set;}
        public string PaymentIntentId {get; set;}



        //the following has been added in the video 264 to persist showing the value of shipping price of a delivery method
        //in the order-total.component.html  which reads the basket.
        //added in client app shared/models/basket.ts IBasket, and CustomerBasket in core project/Entities and CustomerBasketDto in the API project 
        public decimal? shippingPrice {get; set;}
    }
}