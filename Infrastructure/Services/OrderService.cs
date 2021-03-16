using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    //Implement the IOrderService in core project, Interfaces folder.
    //And register IOrderService and OrderService in startup.cs file (or ApplicationServicesExtension in Extensions folder) in API project.
    public class OrderService : IOrderService
    {

        //1-Properties:
        //use the BasketRepository, IGenericRepository (which has ListAll or GetById methods, and ....) for Product, DeliveryMethod and Order Model !
        //(yes ! also for Order model, and that is why we named this file as OrderService, and in it, use IGenericRepository<Order>)
        private readonly IBasketRepository _basketRepo;
        private readonly IGenericRepository<Product> _productRepo;  
        private readonly IGenericRepository<DeliveryMethod> _dmRepo;
        private readonly IGenericRepository<Order> _orderRepo;
        /*
        Note:
        instead of adding IGenericRepository<Product>,  IGenericRepository<DeliveryMethod> and IGenericRepository<Order>,
        (IGenericRepository for the different Models) 
        the lecturer used the UnitOfWork to protect from having partial updates, in video 218 219, but I did not use that !!
        (also the lecturer used that in the PaymentService in video 260 and i did not use that !!)
        the importance of this is:
        for example, example away from the Orders, 
        doing modifications on ProductBrands and Products at the same time, 
        and when we call the requiered methods from the same IGeneric repo, each repo of the instantiated repos will have its own copy (instance) of DbContext (storeContext). 
        Then if the modification on Product successes, but the one in ProductBrand does not ! so we will have a partial update ! and we have to deal with products for a brand that does not exist !
        So we will implement the concept of Unit of Work, which creates one instance of the DbContext for all the instantiated repos, and which rolles back all the changes if any single modification fails to be implemented !
        */



        //2-constructor:
        public OrderService(IBasketRepository basketRepo, IGenericRepository<Product> productRepo, IGenericRepository<DeliveryMethod> dmRepo, IGenericRepository<Order> orderRepo)
        {
            _basketRepo = basketRepo;
            _productRepo = productRepo;
            _dmRepo = dmRepo;
            _orderRepo = orderRepo;
        }


        //3-methods: 
        //a-create an order in the Order table,
        //the basket Id is needed to cpoy its items in records in OrderItems table for a specific Order.
        //remember that "Address" model in Core project, Entites/OrderAggregate folder, is a property in Order model.
        public async Task<Order> CreateOrderAsync(string buyerEmail, int delieveryMethodId, string basketId, Address shippingAddress, string paymentIntentId)
        {
            //once this is called in OrderService, that means we need to create an "Order" record inside Orders table
            //, with its "OredrItems" records inside OrderItems table.
            //And to do that, we need to do few tasks as below:

            //1-get the basket from redis by the methods in _basketRepo:
            var basket = await _basketRepo.GetBasketAsync(basketId);

            //2-now you have the basket, and its Items (Products), so query the full info of these Poducts from the DB using _productRepo.
            //but we need to query again the products from the Products table since we have in redis, the product info stored there as well !?
            //becuase the user might change the price from the frontend ! and might that get saved in redis in his basket !
            //so it is always better to re-check the price from the DB, otherwise, no need for this step since we can read the product info from the ones in the basket.
            //a-initialize a new list of model OrderItem to store in it the products of this Order:
            var items = new List<OrderItem>();
            //b-loop on each item in the above basket, and for each product (item), bring its info from DB by its Id:
            foreach (var product in basket.Items)
            {
                var productItem = await _productRepo.GetByIdAsync(product.Id);
                //now remember that OrederItem model has a property of type ProductItemOrdered,
                //take a new instance of it, and fill it with info from the productItem above:
                //remember that ProductItemOrdered class has a constructor, so pass the values while instantiating to it:
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                //now create the OrderItem instance://not that we passed the price after reading it from the Products table, but the quantity after reading it from the basket:
                var orderItem = new OrderItem(itemOrdered, productItem.Price, product.Quantity);
                //now add this orderItem in the list of items above:
                items.Add(orderItem);
            }

            //3-bring also the info of the delivery method from the _dmRepo according to the DeliveryMethod Id passed to this method:
            var deliveryMethod = await _dmRepo.GetByIdAsync(delieveryMethodId);

            //4-calculate subtotal = considering each product, do sum of(product price * quantity) without considering delivery cost (price):
            //consider the product price from the OrderItem list we just created above, as well the quantity:
            var subTotal = items.Sum(x => x.Price * x.Quantity);

            //5-create the order
            //instantiate an object of "Order" model and pass the above variables to its constructor:
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subTotal, paymentIntentId);
            //IMPORTANT NOTE:
            //"Order" model has an IReadOnlyList<OrderItem>, and in the previous command we passed to it the "items" list we created above out of our basket and Products DB table.
            //now, when we save this order from the previous command to the DB as below, and becauses of EntityFrameWork is smart !
            //an order will be created in the "Orders" table with Id=x. Then EntityFramework will create orderitems in the "OrderItems" table while attaching in the foreignkey of Order Id the value x !
            //so we should not be worried about how the records in the "OrderItems" table are created and attched to the relevant Order Id. 

            //6-save it to the Ordrs table in DB
            _orderRepo.Add(order);
            var result = await _orderRepo.Complete(); //.Complete method in the GenericRepository returns the number of operations done.
            //the lecturer used the UnitOfWork to protect from having partial updates in video 218 219, but I did not use that !!
            //the importance of this is:
            //for example, example away from the Orders, 
            //doing modifications on ProductBrands and Products at the same time, 
            //and when we call the requiered methods from the same IGeneric repo, each repo of the instantiated repos will have its own copy (instance) of DbContext. 
            //Then if the modification on Product successes, but the one in ProductBrand does not ! so we will have a partial update ! and we have to deal with products for a brand that does not exist !
            //So we will implement the concept of Unit of Work, which creates one instance of the DbContext for all the instantiated repos, and which rolles back all the changes if any single modification fails to be implemented !

            //7-delete the basket:
            await _basketRepo.DeleteBasketAsync(basketId);

            //8-return the Order created, and if not, return null.
            if(result <=0){return null;}
            return order; 
        }
        //testing this method with the relevant one in OrdersController is in video 220 221 using postman.




        //b-get an Order by its Id for a specific user (by querying the BuyerEmail):
        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            /*
            we need to Get an "Order" from "Orders" table,
            with the parent record in DeliveryMethods table, 
            and child records in OrderItetms table. 
            so we need to use the Eager loading using .Include().
            since we are using the GenericRepository, we did that with the help of the interface and its implementation:
            ISpecification/BaseSpecification in core project, Data folder,
            with the OrdersWithItemsAndOrderingSpecification file where we wrote those specifications.
            then in the ListAsync method in the GenericRepository, with the help of the SpecificationEvalutor in Data folder,
            we get that.
            */
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            return await _orderRepo.GetEnityWithSpec(spec);
        }




        //c-get all orders for a specific user (by querying the BuyerEmail):
        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            //same note above.
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _orderRepo.ListAsync(spec);
        }





        //d-get the Delivery methods we have from the DeliveryMethods table we have:
        public Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return _dmRepo.ListAllAsync();
        }
    }
}