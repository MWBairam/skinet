using System.IO;
using System.Threading.Tasks;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;

namespace API.Controllers
{
    //Important Note:
    //payment steps:
    //1-this is to create payment intents with stripe (payment processor).
    //2-but after that, the real payment is done from angular frontend side only ! in checkout-payment.component.ts in submitOrder method in confirmCardPayment part !
    //3-when the payment is succeeded, stripe will send us automatically after that, a "web hook" to tell us that the payment is done, so we can update the order in "orders" table, status field from pending to payment complete or failed.
    //remember the picture 257-3 in section 21 folder 
    
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        //1-Properties:
        //use the IPaymentService we designed in Infrastrucure layer, service folder.
        private readonly IPaymentService _paymentService;
        
        //in step 3 above, stripe will send us, so to trust it, we will check what is sent against this below web hook secret.
        //it is brought from
        private readonly string _WhSecret ; //video 278 to see how to bring it for a test environment. //also store it in appsettings.json
        private readonly ILogger<PaymentsController> _logger;
        //private readonly IConfiguration _config;
        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger, IConfiguration config)
        {
            _logger = logger;
            _paymentService = paymentService;
            //_config = config;
            _WhSecret = config.GetSection("StripeSettings:WhSecret").Value;
        }

        [Authorize]
        //this is for the authorized users only, which means for the logged in user only.
        //so that only and only logged in user can send https requests to this method. 
        //https requests coming to here from angualr side should be with the current logged in user's token in the header.
        //like how we did in the  client/src/app/account/account.service.ts in loadCurrentUser method 
        //we will make the below method only with [Authorize] and not the whole controller,
        //because the second method below is accessed by stripe and stripe will not login to here us of course.
        [HttpPost("{basketId}")] //this method will be called like https://localhost:4200/api/payment/<basketId>
        //then we will use the CreateOrUpdatePaymentIntent method we wrote in IPaymentService we designed and injected above.
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);
            //remembers that the CreateOrUpdatePaymentIntent returns the basket updated with DeliverMethodId, PaymentIg and the ClientSecret.
            //so if nothing returned, returns an error BadRequest using the flattened shape we designed in the Errors folder in ApiResponse class while passing he error 400 to it.
            if (basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));
            //if basket is null for any reason or mistake (if the basket is null, the user will not have the ability to go to checkout and checkout-payment.component.ts, but it is better to check that)

            //if not empty, return the updated basket to the frontend:
            return basket;
        }


        //this method is not with [Authorize] as we explained above.
        //stripe will send https post requests to this method so we can get the payment info if succeded or failed 
        //(we configured our stripe account to send those 2 events)
        //remember the explanation above in the Note.
        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            //read what stripe sends us out of the https post request body:
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            //pass the above https post body which we stored as a text in "json" to the ConstructEvent method
            //so we can reconstruct here the stripe (payment succeeded or failed) event in order to process it below.
            //pass to the ConstructEvent method also the web hook secret we identified above, and the stripe-signature in the 
            //https header in order to trust that this really came from stripe !
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _WhSecret);

            //create those 2 variables:
            //a-first one is of type PaymentIntent (from stripe library)
            PaymentIntent intent;
            //b-the second one is of type Order (in Core project, Entities/OrderAggregate folder)
            //stripe library has a class called Order ! so to not confuse the method which one to use,
            //I wrote above using Order = Core.Entities.OrderAggregate.Order;
            Order order;

            //now, using the event we reconstructed above,
            //and remembering that the events we configured in stripe to be sent to this api are 
            //payment_intent.succeeded: the payment has been done successfully after the payment intent had been created.
            //payment_intent.payment_failed: the payment has not been done successfully after the payment intent had been created.
            //and let us process those 2 cases to update the status column in the related order in "Orders" table. 
            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    //the event sent from stripe has the related PaymentIntent, so let us save it in the intent var:
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    //log this:
                    _logger.LogInformation("Payment Succeeded");
                    //now, bring the order record by PaymentIntentId,
                    //the PaymentIntentId of the PaymentIntent we stored in "intent" above.
                    //and update the "status" column.
                    //all that is done in the UpdateOrderPaymentSucceeded method in the PaymentService we designed.
                    order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                    //log that:
                    _logger.LogInformation("Order updated to payment received: ", order.Id);
                    break;
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment failed: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    _logger.LogInformation("Payment failed: ", order.Id);
                    break;
            }

            //after that we should send back to stripe a response (even empty response !) to confirm that we received the event !
            //or stripe will keep trying to send us the event for up to 3 days !
            return new EmptyResult();
        }
    }
}
