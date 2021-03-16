using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        //we can add "public" accessmodifier before the method, 
        //or we can do that in the PaymentService in Infrastructure project where this interface is implemented 

        //1-CreateOrUpdatePaymentIntent:
        /*
        this method receives the basket Id stored in the browser localstorage,
        then create the PaymentIntent with the third party payment processor stripe,
        then returns the basket again. why to return the basket ?
        after creating the payment intent, this method will assign values to the below properties in CustomerBasket model:
        
        public int? DeliveryMethodId {get; set;}
        public string ClientSecret {get; set;}
        public string PaymentIntentId {get; set;}

        so that we need to return the basket with its new valuse so we can read them anywhere else.
        */
        Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId);

        //2-UpdateOrderPaymentSucceeded:
        Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId);

        //3-UpdateOrderPaymentFailed:        
        Task<Order> UpdateOrderPaymentFailed(string paymentIntentId);
    }
}