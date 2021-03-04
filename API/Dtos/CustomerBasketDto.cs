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
    }
}