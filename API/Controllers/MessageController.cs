using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        //1-properties:
        private readonly IMessageService _messageService;
        private readonly IMapper _mapper;
 
        //2-constructor:
        //dependency injection:
        public MessageController(IMessageService messageService, IMapper mapper)
        {
            _messageService = messageService;
            _mapper = mapper;
        }


        //3-methods:
        [HttpPost("sendmessage")]
        public async Task<ActionResult<MessageDto>> sendMessage(MessageDto MessageDto)
        {
            //submit the message using the submitMessage in messageService,
            //which will return the same message as well:
            var userMessage = await _messageService.submitMessage(MessageDto.firstName, MessageDto.lastName, MessageDto.address, MessageDto.email, MessageDto.message);
            
            //_messageService.submitMessage will return type of "Message" entity,
            //map it to MessageDto  (no need for mapping profile in Helper folder, MappinProfiles because the fields in Message and MessageDto are clear and easy to map by the mapper)
            return  _mapper.Map<Message, MessageDto>(userMessage);

        }
    }
}