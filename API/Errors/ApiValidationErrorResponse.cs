using System.Collections.Generic;

namespace API.Errors
{
    //this class is exactly as same as the ApiResponse
    //this class will be used to re-shape the "validation-based bad request" exception
    //it inherits the ApiResponse class
    //the only new thing in it and not existed in the ApiResponse is the "Errors" (array of errors)
    /*the validation-based bad request has a list of errors in it, example:
    {
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "00-a7d512509133dd4888bb34b9fbe58e13-23546fd62544c449-00",
    "errors": {
        "id": [
            "The value 'five' is not valid."
        ]
    }
    look at the "errors": {}
    a typical example of such one is validating a form where the user did not insert all the data with the appropriate types ! 
    so that we are creating this "Errors" Array of errors */

    public class ApiValidationErrorResponse : ApiResponse
    {
        //Attributes:
        public IEnumerable<string> Errors { get; set; }



        //Constructor,
        //it has the :base(statuscode, message) part which is inherited
        //then the inherited part, send the 400 as a "StatusCode", and do not send anything in the "message"
        public ApiValidationErrorResponse() : base(400)
        {
        }




        //now simply use this class in the startup file:
        
    }
}