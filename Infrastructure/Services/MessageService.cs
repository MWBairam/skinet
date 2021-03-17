using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class MessageService : IMessageService
    {
        //1-properties:
        private readonly IGenericRepository<Message> _messageRepo;
     
        //2-constructor:
        //dependency injection:
        public MessageService(IGenericRepository<Message> messageRepo)
        {
            _messageRepo = messageRepo;
        }

        //3-methods:
        public async Task<Message> submitMessage(string firstName, string lastName, string address, string email, string message)
        {
            var userMessage = new Message(firstName, lastName, address, email, message);
            
            _messageRepo.Add(userMessage);
            var result = await _messageRepo.Complete(); 

            return userMessage;
        }
    }
}