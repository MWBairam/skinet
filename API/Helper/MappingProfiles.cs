using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Helper
{

   //inherit the Prfile class whcih is from the above AutoMapper library
    public class MappingProfiles : Profile
    {
        //constructor
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
               .ForMember(d => d.ProductBrand, x => x.MapFrom(s => s.ProductBrand.name))
               .ForMember(d => d.ProductType, x => x.MapFrom(s => s.ProductType.name))
               .ForMember(d => d.PictureUrl, x => x.MapFrom<ProductUrlResolver>());

            //we mentioned how to map ProductBrand and ProductType from Product Entity to the ProductToReturnDto 
            //because the auto mapper will face problems doing that since the attributes ProductBrand and ProductType in the ProductToReturnDto are string type not like in the Product Entity class
            
            //also for the PictureUrl:
            //we notice that the returned pictureUrl is for example: images/products/sb-ang1.png
            //indeed, the API consumer should receive the full url https://<IP>:port/<PictureUrl>
            //so use the ProductUrlResolver in the Helper folder
            
            //for other paramters, Id, price, ... the name and type match exactly each other in the two classes, so no need to mention them here

            //now go to startup.cs file, and register the mapper as a service

            //then use this map in the ProductController functions 



            CreateMap<CustomerBasketDto, CustomerBasket>(); //no need for properties mapping, because the Dto has exactly the same properties in the model
            CreateMap<BasketItemDto, BasketItem>(); //no need for properties mapping, because the Dto has exactly the same properties in the model

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>(); //no need for properties mapping, because the Dto has exactly the same properties in the model
            //we have 2 "Address" model, in Core/Entities/Identity/Address, or the Core/Entities/OrderAggregate/Address
            //so we specified the one we want which is related to Order part.


            //the below 2 mapping profiles are created for the Get methods in OrdersController GetOrderByIdForUser:
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));
                //other parameters do not need to be mapped manually since tests in postman shows correct results.
            //Also:
            //in "Order" model, there is a method named as "GetTotal" which calculates:
            // return Subtotal + DeliveryMethod.Price;
            //so in API project, Helper/MappingProfiles.cs where we map the "Order" to "OrderToReturnDto",
            //the IMapper is clever enough to notice the keyword "Get" in the method name,
            //and will generate a property called "Total" in OrderToReturnDto,
            //and no need to write anything to tell it to do that !            
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<OrderItemUrlResolver>());
                //for the previous /ForMember mapping:
                //we notice that the returned pictureUrl is for example: images/products/sb-ang1.png
                //indeed, the API consumer should receive the full url https://<IP>:port/<PictureUrl>  
                //so we used for it the OrderItemUrlResolver to add the https://<IP>:port/
                               
                //other parameters do not need to be mapped manually since tests in postman shows correct results.


                CreateMap<Message, MessageDto>();
        }
    }
}