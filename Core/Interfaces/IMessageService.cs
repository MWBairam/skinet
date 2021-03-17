using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IMessageService
    {
        Task<Message> submitMessage(string firstName, string lastName, string address, string email, string message);
    }
}