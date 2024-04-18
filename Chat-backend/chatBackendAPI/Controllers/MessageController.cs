using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using chatBackendAPI.Contracts;
using chatBackendAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace chatBackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService messageService;
        public MessageController(IMessageService messageService)
        {
            this.messageService = messageService;
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            var messages = this.messageService.GetAll();
            return Ok(messages);
        }
        
        
        [HttpGet("received-messages/{userId}")]
        public IActionResult GetUserReceivedMessages(string userId)
        {
            var messages = this.messageService.GetReceivedMessages(userId);
            return Ok(messages);
        }
        [HttpPost()]
        public async Task<IActionResult> DeleteMessage([FromBody]MessageDeleteModel messageDeleteModel)
        {
            var message=await this.messageService.DeleteMessage(messageDeleteModel);
            return Ok(message);
        }

        [HttpPost("deleteChatHistory/{userId}")]
        public IActionResult DeleteUserChatHistory(string userId)
        {
            this.messageService.DeleteUserChatHistory(userId);
            return Ok();
        }
    }
}