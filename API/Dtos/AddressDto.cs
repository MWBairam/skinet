
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class AddressDto
    {
        //we could have done the below [Required] and [...] ... validations using Data Annotation in Core/Entities/Identity/Address, 
        //but we choosed not to do it on Entity level, only on Dto level
        //that is to avoid using libraries as dependencies in Core project !       

        [Required] 
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Street { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string State { get; set; }
        [Required]
        public string Zipcode { get; set; }
    }
}