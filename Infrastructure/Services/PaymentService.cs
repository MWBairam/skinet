using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Configuration;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;
using Product = Core.Entities.Product;

namespace Infrastructure.Services
{
    //Implementing the IPayment interface in core project
    public class PaymentService : IPaymentService
    {
        //1-properties:
        private readonly IGenericRepository<Product> _productRepo;  
        private readonly IGenericRepository<DeliveryMethod> _dmRepo;
        private readonly IGenericRepository<Order> _orderRepo;
        //we may need to access the "Products", "DeliveryMethods" and "Orders" tables in the DB to read the Data there !
        //so initialize a repo (from the IGenericRepository/GenericRepository) for each model (so we can use the Generic methods like listAllAsync)
        private readonly IBasketRepository _basketRepository; 
        //use IBasketRepository where methods, to read the basket from redis, are existed.
        //we need to read the current basket to create the PaymentIntent according to the items in it.
        private readonly IConfiguration _config;
        //IConfiguration which allows us to read the appSettings.json where we stored our stripe (payment processor) keys.

        /*
        Note:
        instead of adding IGenericRepository<Product>,  IGenericRepository<DeliveryMethod> and IGenericRepository<Order>,
        (IGenericRepository for the different Models) 
        the lecturer used the UnitOfWork to protect from having partial updates, in video 260 and I did not use that !!)
        (also the lecturer used that in OrderServcice, in video 218 219, but I did not use that !!)
        
        the importance of this is:
        for example, example away from the Payment, 
        doing modifications on ProductBrands and Products at the same time, 
        and when we call the requiered methods from the same IGeneric repo, each repo of the instantiated repos will have its own copy (instance) of DbContext (storeContext). 
        Then if the modification on Product successes, but the one in ProductBrand does not ! so we will have a partial update ! and we have to deal with products for a brand that does not exist !
        So we will implement the concept of Unit of Work, which creates one instance of the DbContext for all the instantiated repos, and which rolles back all the changes if any single modification fails to be implemented !
        */




        //2-constructor:
        //Dependency Injection
        public PaymentService(IBasketRepository basketRepository, IConfiguration config, IGenericRepository<Product> productRepo, IGenericRepository<DeliveryMethod> dmRepo, IGenericRepository<Order> orderRepo)
        {
            _config = config;
            _basketRepository = basketRepository;
            _productRepo = productRepo;
            _dmRepo = dmRepo;
            _orderRepo = orderRepo;
        }





        //3-methods:
        //a-CreateOrUpdatePaymentIntent:
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
        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            //1)
            //frommy account in stripe.com, I brought the Publishibale key and the secret key,
            //then stored them in appSettings.json (since it is a file which is not uploaded publicily to github),
            //then let use read that key and store it in StripeConfiguration.ApiKey (which comes from the Stripe library above).
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];



            //2)
            //now bring the basket which has the Id passed to thid method above.
            //remember that basket is stored in redis, and there is no relation between the logged in user's email/Id and the basket,
            //since the basket can be added anonymously without the user being logged in !
            //and the basket is the same per browser for any user ! and is loaded once the website is launched since the basketId is stored in the browser localstorage.
            var basket = await _basketRepository.GetBasketAsync(basketId);

            //2-a)
            //if basket is null for any reason or mistake (if the basket is null, the user will not have the ability to go to checkout and checkout-payment.component.ts, but it is better to check that)
            if(basket == null) return null;



            //3)
            //let us determine the shippingPrice we want to take from the customer for a payment:
            //Initialize it as zero at first:
            var shippingPrice = 0m; //m means decimal
            //check if the basket has the DeliveryMethodId with a value,
            //(which means that the user proceeded to checkout, and in the delivery tab, the user has chosen a DeliveryMethod which its Id got stored in the basket DeliveryMethodId property) 
            //(if it is null, that means the user did not proceed to checkout yet, and we will keep shippingprice to 0 as above)
            //indeed, we will not reach this method CreateOrUpdatePaymentIntent unless the user is in the checkout page, in Payment tab,
            //which means he was forced to choose to a delivery method. but it is good to validate that here again.
            if(basket.DeliveryMethodId.HasValue)
            {
                //bring the delivery method from the DeliveryMethods table acording to the delivery method Id we have:
                var dm = await _dmRepo.GetByIdAsync((int)basket.DeliveryMethodId); //DeliveryMethodId is identified as int? in Customerbasket model, and GetByIdAsync receives an int, so cast the DeliveryMethodId as int using (int)
                //now read the delivery price from dm, and assign it to the shippingprice:
                shippingPrice = dm.Price;

                //we could have stored the delivery price in the basket (CustomerBasket model) directly, but it is better not to trust what is really stored in a basket
                //so store the DeliveryMethodId only, and bring its data from the table.
            }



            //4)
            //now, let us say we do not trust the product price as it is stored in redis, becuase it is easy for some fraudesters to update it from the frontend,
            //so let us check the product price as in item in the basket if equals the price in the Products DB table,
            //and if not, let us re-update the price in the basket:
            foreach(var item in basket.Items) //Items is where we store the products in CustomerBasket model
            {
                //bring the product info from the Products table on the DB according to its Id stored in the basket:
                var productItem = await _productRepo.GetByIdAsync(item.Id);
                //now compare the product's price in the basket with the one in the DB:
                if(item.Price != productItem.Price)
                {
                    //if we reached this level here, that means the user tried to make a fraud to update the product price somehow,
                    //so reset it in the basket to be as the price in the DB:
                    item.Price = productItem.Price;
                }
            }




            //5)
            //now create the Payment Intent which will be sent to the "Stripe" payment processor, which will process the intent and
            //returns a clientSecret to be used when submitting an order. 
            //please remember the picture 257-3 in course section 21 
            /*
            first validate if the PaymentId in the basket (remembers the BasketMoel) is null,
            which means that the user did not try to pay before this moment, so we are creating a new Intent.

            if it is null, so that for the PaymentId stored in the basket, the user is trying to update his basket, after the Intent has been created
            then go to payment back again.
            */
            //a-instantiate an instance of PaymentIntentService (from the stripe library) which is ussed to send the Intent:
            var service = new PaymentIntentService();
            //b-create a property of type PaymentIntent to store the customer in it:
            PaymentIntent intent;
            //c-to what account in stripe we should consider the intent belongs to ?
            //to our account, and remember that above we set the StripeConfiguration.ApiKey to our key.
            //d-check if PymentId is empty or not as we said above:
            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                //if empty, that means we are creating an Intent for the first time,
                //so create the options we want to fill in the Intent to be sent:
                //Intent options are identified in the class PaymentIntentCreateOptions which comes from the stripe library:
                var options = new PaymentIntentCreateOptions
                {
                    //The amount of the application (order) fee (if any) that will be applied to the payment,
                    //and transferred to the application owner’s Stripe account.
                    //which is here the sum of the basket products price*Quantity for each. plus the shippingPrice we had above.
                    //stripe does not accept decimal numbers, so cast the result in (long) format.
                    //to convert from decimal to long, we must get rid of the 2 decimal digits after the comma, so multiply with *100
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                    //Three-letter ISO currency code, in lowercase. Must be a supported currency in stripe:
                    Currency = "usd",
                    //Payment-method-specific configuration for this PaymentIntent.
                    //we may have multiple methods as identified in stripe, so store all the methods in a list.
                    PaymentMethodTypes = new List<string> { "card", },
                };
                //the PaymentIntentService has a method called CreateAsync which communicates with stripe over the internet,
                //and create the Intent:
                intent = await service.CreateAsync(options);
                //CreateAsync method returns 2 values after the intent is created,
                //an Id and ClientSecret to be used when the user will submit the order after the intent is created.
                //please remember the picture 257-3 in course section 21 
                //so store these 2 parameters in the PamentIntentId and ClientSecret in the basket (remember the Customerbasket model) so we can send read them from the basket from anywhere else.
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            //now discuss the case the paymentId in the basket is not empty as we explained above:
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    //the user is just updating his basket, so just update the amount again:
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100
                };
                //and use the UpdateAsync method from the PaymentIntentService:
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }
            
            //now in the basket we have the DeliveryMethodId and PaymentId and the ClientSecret,
            //so store them officially in redis: 
            await _basketRepository.UpdateBasketAsync(basket);
            //and return the updated basket so we can use read it somehwere else:
            return basket;
        }

        public async Task<Order> UpdateOrderPaymentFailed(string _paymentIntentId)
        {
            //we need first to get the order record from the "Orders" table by the passed PaymentIntentId:
            //form the expression o => o.PaymentIntentId = _paymentIntentId:
            var spec = new OrderByPaymentIntentSpecification(_paymentIntentId);
            //call the GetEnityWithSpec from the GenericRepository<Order> while passing the spec we created.
            //the GetEnityWithSpec method will send this instantiated class to the SpecificationEvaluator in Infrastructure project, Data folder,
            //in which, the .where(//our expression) statment is formed to be used when queryin the _StoreContext.
            var order = await _orderRepo.GetEnityWithSpec(spec);
            //validate if we really got something from the DB:
            if (order == null) return null;
            //now update the "status" column in the brought order:
            order.Status = OrderStatus.PaymentFailed; //PaymentFailed is in the core project, models?Entities/OrderAggregate, OrderStatus enum
            _orderRepo.Update(order);
            var result = await _orderRepo.Complete();
            if(result <=0){return null;}

            return order;
        }

        public async Task<Order> UpdateOrderPaymentSucceeded(string _paymentIntentId)
        {
            //same notes in the previous method.
            
            var spec = new OrderByPaymentIntentSpecification(_paymentIntentId);
            var order = await _orderRepo.GetEnityWithSpec(spec);

            if (order == null) return null;

            order.Status = OrderStatus.PaymentRecevied;
            _orderRepo.Update(order);

            var result = await _orderRepo.Complete();
            if(result <=0){return null;}

            return order;
        }
    }
}