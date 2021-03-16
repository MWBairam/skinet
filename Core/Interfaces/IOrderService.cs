using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        //we can add the "Public" modifier at the begininng.
        //in the signatures below, it is better to say read only list other than list, so we protect the reurned list from modifications

        //models used below are from the Entities folder.

        //create an order in the Order table,
        //the basket Id is needed to cpoy its items in records in OrderItems table for a specific Order.
        Task<Order> CreateOrderAsync(string buyerEmail, int delieveryMethod, string basketId, Address shippingAddress, string paymentIntentId);

        //get all orders of a specific suer (by querying the BuyerEmail):
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);

        //get an Order by its Id:
        Task<Order> GetOrderByIdAsync(int id, string buyerEmail);

        //get the Delivery methods we have from the DeliveryMethods table we have:
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
    }

    //implement it in the Infrastructure project, Services folder, OrderRepository.
    //and register IOrderService and OrderService in startup.cs file (or ApplicationServicesExtension in Extensions folder) in API project.
}