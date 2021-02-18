using System.Collections.Generic;

namespace API.Helper
{
    //we need to know the page number in which we are in ! besides the available number of pages !
    //this will not be only for "Products", it will be used for any Entity, so make generic <T>
    //add a constrain to it to be used for classes only -_- (that means can take any class)
    //(another class of constrains is in the IGenericRepository interface in the Core project, we constrained it for classes were derived from the BaseEntity class)
    public class Pagination<T> where T : class
    {


        //Attributes:
        public int PageIndex {get; set;}
       public int PageSize {get; set;}
       public int Count {get; set;}
       public IReadOnlyList<T> Data {get; set;} 





        //Constructor:
        public Pagination(int pageIndex, int pageSize, int count, IReadOnlyList<T> data)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            Data = data;
        }




       //for example, the clinet side filtered Products with Type=boots
       //we need to set the "Count" attribute to the value of how many boots items we have to claculate the available number of pages
       //we start this step form the IGenericRepository in CountAsync function
    }
 
}