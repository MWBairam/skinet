import uuid from 'uuid/v4';


//from swagger or postman, the returned https response when we call the GetBasket method in Basketontroller 
//shoudl be exactly as we desingned in core project, Entities folder,
//a CustomerBasket which has "Id" and array of "BasketItem",
//and each BasketItem has an id, productname, price ......

//so the below front end model should be exatly the same !

export interface IBasket {
    id: string;
    items: IBasketItem[];

    //Another set of properties were added in video 260, 262 to support the checkout (in particular, the payment tab) process:
    //? means it is optional and can be null. 
    //So those are optional during basket creation (will be empty) and will get set to a value when the user do the payment.
    //remember the PaymentSevice in infrastructure project in Services folder.

    //and according to this, we need to update the CustomerBasketDto in Dtos folder and CustomerBasket in Entities in core project.
    deliveryMethodId?: number;
    clientSecret?: string;
    paymentIntentId?: string;

    //the following has been added in the video 264 to persist showing the value of shipping price of a delivery method
    //in the order-total.component.html which reads the basket.
    //added in client app shared/models/basket.ts IBasket, and CustomerBasket in core project/Entities and CustomerBasketDto in the API project 
    shippingPrice?: number;
}
export interface IBasketItem {
    id: number; //it is going to be the IProduct Id !! (see explanation in basket.service.ts ! in addOrUpdateItemQuantity() method)
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

//let us remember that we are storing the baskets (and each basket items) inside redis, not sql !
//so when we create a new basket from the frontend angular side, we should give it an Id from here ! because 
//redis will not generate id for it like sql automatically !
//so in the below class, implement the above intrface (model) so that once the IBasket is instantiated (we created an instance of it) an
//id is generated using the uuid which generates renadom Ids !
//For, items of type IBasketItem[], do not do anything with it, just keep it empty and initialize it as an empty array. 

export class Basket implements IBasket {
    id = uuid();  //npm install uuid@3.4.0
    items: IBasketItem[] = []; //initialize it as an empty array (it equals = new IBasket[]() if we were writing C#)
}



//the following is not a part of the basket{"id": , "item": }, but it is used when we are in basket.component.html (below the html table we created where we displayed what was added to the basket) to show "total" calculations.
//we will create for that a component (order-totals.component.ts), then we will call it in the basket.component.html using <app-order-totals></app-order-totals>
//and we should create the below interface (angular model) for that:
export interface IBasketTotals 
{
    shipping: number;  //shiping cost
    subtotal: number;  // sum of each product price * its quantity
    total: number;     //sum of the above two params
}