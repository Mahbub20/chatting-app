using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chatBackendAPI.Models
{
    public class MessageDeleteModel
    {
        public string DeleteType { get; set; } = "";
        public Message Message { get; set; } = new Message();
        public string DeletedUserId { get; set; } = "";
    }
}