using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using chatBackendAPI.Models;

namespace chatBackendAPI.Contracts
{
    public interface IMessageServiceQuery
    {
        IEnumerable<Message> GetAll();
        IEnumerable<Message> GetReceivedMessages(string userId);
    }
}