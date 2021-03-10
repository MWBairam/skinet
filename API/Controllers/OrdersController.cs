using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize] 
    //this is for the authorized users only, which means for the logged in user only.
    //so that only and only logged in users can send https requests to this controller. 
    //https requests coming to here from angualr side should be with the current logged in user's token in the header.
    //like how we did in the  client/src/app/checkout/checkout.service.ts in getDeliveryMethods() method 
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        //1-Properties:
        private readonly IOrderService _orderService; //IOrderService we designed in Core project, Interfaces folder and implemented in Infrastructure project, Services folder
        private readonly IMapper _mapper; //the service from microsoft which allow us to map a model from Core project, Entities folder and Dto from Dtos folder according to the mapping in Helper/MappingProfiles
        
        //2-Constructor:
        //inject the below services:
        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _mapper = mapper;
            _orderService = orderService;
        }

        //3-Methods:
        //a-create an Order:
        //we will send https Post request from the client Angular frontend side carrying the body the info described in OrderDto (from angular side it is the IOrder model) 
        //so recieve it in here in the method.
        //and when the order is submitted to DB, return it entierly, not only in the shape of OrderDto.
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            //we will call the method createOrderAsync in the OrderService to submit an Order in the DB Orders table.
            //we need to pass to it the current logged in user's email, the DeliverMethod Id which is choosen, the basketId, and "Address" object info.

            //1-bring the current logged in user's email:
            //the ? means that this can be a null. And if any of User or Claims is null, "email" will be null,
            //indeed, above we wrote [Authorize] so that only logged in user's can send a post https request to here, so email will never be null !
            //(also remember that in angular we implemented the auth.guard.ts which will not allow the user to create an order unless he is logged in)
            //first bring the user's email, but how?
            //remember that we have implemented the usage of tokens:
            /*
            -ITokenService we designed it in Core project, interfaces folder, 
            -and implemented it in Infrastructure project, Services folder.
            -it is to generate tokens once the user logins or registers, and send it to the user after his login/register
            -so that he will send this token with each https request he sends.
            */
            //when the client angular side sends the https request https://locallhost:4200/api/orders, 
            //it will be with authorization header which contains the current logged in user's token !
            //remember that in TokenService in (Infrastructure project in Services folder) when we formed the token,
            //we embedded the use's Email and DisplayName as a list of "Claims".
            //now from the received token (in the authorization header of the https request https://locallhost:4200/api/orders), 
            //we can re-extract the use's Email using the microsoft HttpContext service, and User property, to the Claims list sub-property, to take the Email value out of it.
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type ==ClaimTypes.Email)?.Value;

            //2-extract the Address info in the passed OrderDto:
            //data received from angular side in the shape of OrderDto have inside it the Address in the shape of AddressDto (property name is ShipToAddress),
            //so extarct it and map it to the "Address" model (which is used in OrederService.cs) (the Address model in Core/Entities/OrderAggregate/Address, not the one Identity folder)
            //mapping profile is in the Helper/MappingProfiles.cs file:
            var address = _mapper.Map<AddressDto, Core.Entities.OrderAggregate.Address>(orderDto.ShipToAddress);
            //we have 2 "Address" model, in Core/Entities/Identity/Address, or the Core/Entities/OrderAggregate/Address
            //so we specified the one we want which is related to Order part.

            //the basketId and DeliverMethodId are passed from angulaer side as well in the recieved OrderDto.

            //now, we will call the method createOrderAsync in the OrderService to submit an Order in the DB Orders table.
            //we need to pass to it the current logged in user's email, the DeliverMethod Id which is choosen, the basketId, and "Address" object info.
            var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address);
            //we have called the CreateOrderAsync from the OrderService.
            //and there an Order will be submitted to DB in "Orders" table with the relevant OrderItems in "OrderItems" table !
            //then the submitted order will be returned and we stored it in the previous command in var order.

            //if no order is created with the above info, return the BadRequest error,
            //and displaying the https error 400 we flattened and re-designed in Errors folder, ApiResponse class (with the help of MiddleWare folder)
            if (order == null) return BadRequest(new ApiResponse(400, "Problem creating order"));

            //if order is created successfully and submitted to DB, return it to the angular side so we can display again:
            //and return it entierly, not only in the shape of OrderDto.
            return order;
        }
        //testing this method with the relevant one in OrdersService is in video 220 221 using postman.




        [HttpGet]
        //get all orders for a specific user (by querying the BuyerEmail):
        public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser()
        {
            //how we brought the logged in user email ? please read the note above in the CreateOrder method.
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type ==ClaimTypes.Email)?.Value;

            //use the orderService
            var orders = await _orderService.GetOrdersForUserAsync(email);

            //return from each order, only what is defined in the OrderToReturnDto:
            //the mapping is configured in Helper folder, MappingProfiles.cs:
            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
            //the OrderDto used in the createOrder was created to match data received from the angular side.
            //this OrderToReturnDto is the data we are sending to the angular side to display there.
        }

        [HttpGet("{id}")]
        //get an Order by its Id for a specific user (by querying the BuyerEmail):
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            //how we brought the logged in user email ? please read the note above in the CreateOrder method.
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type ==ClaimTypes.Email)?.Value;
            //use the orderService
            var order = await _orderService.GetOrderByIdAsync(id, email);

            //if no order, return the NotFound error,
            //and displaying the https error 404 we flattened and re-designed in Errors folder, ApiResponse class (with the help of MiddleWare folder)
            if (order == null) return NotFound(new ApiResponse(404));

            //return from the order, only what is defined in the OrderToReturnDto:
            //the mapping is configured in Helper folder, MappingProfiles.cs:
            return _mapper.Map<OrderToReturnDto>(order);
            //the OrderDto used in the createOrder was created to match data received from the angular side.
            //this OrderToReturnDto is the data we are sending to the angular side to display there.
        }

        [HttpGet("deliveryMethods")]
        //get all the Deliverymethods:
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            //use the orderService
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }
        
    }
}