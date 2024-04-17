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
        private readonly IMessageServiceQuery messageServiceQuery;
        private readonly IMessageService messageService;
        public MessageController(IMessageServiceQuery messageServiceQuery,IMessageService messageService)
        {
            this.messageServiceQuery = messageServiceQuery;
            this.messageService = messageService;
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            var messages = this.messageServiceQuery.GetAll();
            return Ok(messages);
        }
        
        
        [HttpGet("received-messages/{userId}")]
        public IActionResult GetUserReceivedMessages(string userId)
        {
            var messages = this.messageServiceQuery.GetReceivedMessages(userId);
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