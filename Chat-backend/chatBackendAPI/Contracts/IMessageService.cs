using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using chatBackendAPI.Models;

namespace chatBackendAPI.Contracts
{
    public interface IMessageService
    {
        void Add(Message message);
        Task<Message> DeleteMessage(MessageDeleteModel messageDeleteModel);
        void DeleteUserChatHistory(string userId);
    }
}