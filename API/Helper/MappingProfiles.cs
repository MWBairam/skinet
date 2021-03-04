using API.Dtos;
using AutoMapper;
using Core.Entities;

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



            CreateMap<CustomerBasketDto, CustomerBasket>(); //no need for properties mapping, because the Dtp has exactly the same properties in the model
            CreateMap<BasketItemDto, BasketItem>(); //no need for properties mapping, because the Dtp has exactly the same properties in the model

        }
    }
}