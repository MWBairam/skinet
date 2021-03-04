
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class BasketItemDto
    {
        //we could have done the below [Required] and [...] ... validations using Data Annotation in Core/Entities/Identity/BasketItem, 
        //but we choosed not to do it on Entity level, only on Dto level
        //indeed, the Dto properties here below are exactly as the model BasketItem in Core/Entities !
        //but the reason of using this Dto is we said above, we want to do validations using annotations here !
        //that is to avoid using libraries as dependencies in Core project !


        [Required]
        public int Id { get; set; }

        [Required]
        public string ProductName { get; set; }

        [Required]
        [Range(0.1, double.MaxValue, ErrorMessage = "Price must be greater than zero")] //the range is from 0.1 to the max value of a double number (protect the price from being 0)
        public decimal Price { get; set; }

        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required]
        public string PictureUrl { get; set; }

        [Required]
        public string Brand { get; set; }

        [Required]
        public string Type { get; set; }
    }
}