using System;

namespace API.Errors
{
    //in this class we will build a consistent (unified) error response for the errors we presented in Controllers\BuggyController
    //use this response in the Controllers\ByggyController to retrun it one NotFOund() and BadRequest() errors are generated !
    public class ApiResponse
    {
        //Attributes:
        //each error response will have these properties:
        public int StatusCode { get; set; }
        public string Message { get; set; }


        //Constructor:
        //we will set the Status code by our selves when we take an instance of this class !
        //for example, in Controllers\BuggyController when we generated the NotFound(new ApiResponse (400)) we instantiated this class while passing 400
        //the message will be determined as below in the GetDefaultMessageForStatusCode() function, 
        //so that initiate the message=null since we are not passing it from the BuggyController, then say if message=null, use the default message !
        public ApiResponse(int responseStatusCode, string responseMessage = null)
        {
            StatusCode = responseStatusCode;
            Message = responseMessage ?? GetDefaultMessageForStatusCode(StatusCode);
            // the "??" means if what is on the left is null, perform what is on the right 
        }


        //methodes:
        //this is used above in the constructor:
        private string GetDefaultMessageForStatusCode(int _StatusCode)
        {
            //we will use a new switch command here
            //according to the value of _StatusCode value, we will return a specific error message
            //we will write the error messages as most of developer write, using the Yoda way ! it is cool and fancy 
            //the _ means if the StatusCode was not any of the values listed in the se=witch below
            return _StatusCode switch
            {
                400 => "A bad request, you have made",
                401 => "Authorized, you are not !",
                404 => "Resource found, it was not",
                500 => "Errors are the path to the dark side. Errors lead to anger. Anger leads to hate. Hate leads to carrier change",
                _ => null
            };
        }
    }
}