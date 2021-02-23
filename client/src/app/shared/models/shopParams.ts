//this is not a model that matches data to be returned from the Data base
//it is just to provide more space in the shop.component.ts by writing the parameters (of bringing a sorted/filtered/paginated list of products) here

//it is indeed shop specific, but we will not create it in the shop folder, we will stick in creating it in here

//we will create it as a class, not angular interface (model), becuase a class gives us the ability to set the values of its attributes once the class is instantiated

export class shopParams
{
  //the following will be used when we get a filtered list of products according to brandId and typeId:
  brandId: number = 0; //initial value of 0 
  typeId: number = 0; //initial value of 0 
  //the following will be used when we get a sorted list of products:
  sort: string = 'name'; //initial value of 'name'
  //the follwoing will be used for pagination:
  pageNumber = 1; //initial value of 1 //as we sat that in the Core project, Specifications folder
  pageSize = 9; //initial value of 6 //as we sat that in the Core project, Specifications folder
  //the following will be used for search:
  search: string;
}