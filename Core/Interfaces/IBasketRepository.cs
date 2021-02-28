using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IBasketRepository
    {
        //we cannot use the already existed IGenericRepository because that uses entityframework to connects to sql
        //and the basket functionality deals with redis !

        //three methods signatures:
        //there is not "CreateBasketAsync" method, becuase creation will be be done as well by the Update method
        Task<CustomerBasket> GetBasketAsync(string basketId);
        Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket);
        Task<bool> DeleteBasketAsync(string basketId);
    }
}