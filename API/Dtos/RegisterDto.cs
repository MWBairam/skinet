
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterDto
    {
        //we could have done the below [Required] and [...] ... validations validation using Data Annotation in Core/Entities/Identity/AppUser, 
        //but we choosed not to do it on Entity level, only on Dto level 
        //that is to avoid using libraries as dependencies in Core project !
        
        [Required] 
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress] //check the email if contains @ and . and .... 
        public string Email { get; set; }
        [Required]
        [RegularExpression("(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$", ErrorMessage = "Password must have 1 Uppercase, 1 Lowercase, 1 number, 1 non alphanumeric and at least 6 characters")]
        public string Password { get; set; }
        //in the regular expression, we identified the password policy: (from https://regexlib.com/Search.aspx?k=password)
        //This regular expression match can be used for validating strong password. It expects atleast 1 small-case letter, 1 Capital letter, 1 digit, 1 special character and the length should be between 6-10 characters. The sequence of the characters is not important. This expression follows the above 4 norms specified by microsoft for a strong password.
    }
}