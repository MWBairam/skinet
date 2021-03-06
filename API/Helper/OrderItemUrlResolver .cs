using API.Dtos;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Configuration;

namespace API.Helper
{

    //we used this resolver in the MappingProfiles in Helper folder when we mapped "OrderItem" model to "OrderItemDto"
    
    //we notice that the returned pictureUrl is for example: images/products/sb-ang1.png
    //indeed, the API consumer should receive the full url https://<IP>:port/<PictureUrl>
    //we will configure it for localhost, later when we publish, we will replcae localhost with the IP of the machine we are publishing on

    //in the appsettings.Development.json, add:
    //"ApiUrl" : "https://localhost:5001/"


    //use the microsoft already defined interface IValueResolver, which is a generic interface
    //pass to it the source class, destination class, type of the attribute to resolve:
    public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemDto, string>
    {

        //1-Properties:        
        private readonly IConfiguration _config;

        //2-constructor
        //this constructor injects the IConfiguration microsoft already defined interface (Dependency Injection)
        //IConfugration will allow us to read the appSettings.Development.json and appSettings.json        
        public OrderItemUrlResolver(IConfiguration config)
        {
            _config = config;
        }


        //3-methods:
        //we inherited an interface, we should implement it here:        
        public string Resolve(OrderItem source, OrderItemDto destination, string destMember, ResolutionContext context)
        {
            //validate if the PictureUrl is empty
            //this is not going to happen, because we made the PictureUrl in the DB table requiered (not nullable) but it is good to check again            
            if (!string.IsNullOrEmpty(source.ItemOrdered.PictureUrl))
            {
                //as long as it is not null, add the https://<IP>:port/ to the url                
                return _config["ApiUrl"] + source.ItemOrdered.PictureUrl; //read the "ApiUrl" from appSettings.Development.json
                //be careful to use this library: Microsoft.Extensions.Configuration
                //not this AutoMapper.Configuration
                //or the _config[] will not work !                
            }

            return null;
        }
    }
}