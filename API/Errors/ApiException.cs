namespace API.Errors
{
    //read first the note in the top of the ApiResponse class
    
    //this class is exactly as same as the ApiResponse, so it is considered an expansion for it
    //this class will be used to re-shape the "server error" exception
    //it inherits the ApiResponse class
    //the only new thing in it and not existed in the ApiResponse is the "Details" 
    //this will carry the lines of an exception stack where we can find useful info, such as:
    /*System.NullReferenceException: Object reference not set to an instance of an object.
    at API.Controllers.BuggyController.GetServerError() in F:\3-Courses And Books\8-Web Developement\4-C# ASP .NetCore MVC\Projects and other courses\3-Project 3 - eCommerce with Angular and APIs\skinet\API\Controllers\BuggyController.cs:line 56
    at lambda_method10(Closure , Object , Object[] )*/

    public class ApiException : ApiResponse
    {
        //create the Details attribute:
        public string Details { get; set; }

        //Constructor:
        public ApiException(int responseStatusCode, string responseMessage = null, string responseDetails = null) : base(responseStatusCode, responseMessage)
        {
           Details = responseDetails;
        }

        //now we will create Middleware folder, and in it, create the ExceptionMiddleWare class
        //then in startup file, intead of the follwoing:
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
        //we will use our new Exception handler, the ExceptionMiddleWare class

    }
}