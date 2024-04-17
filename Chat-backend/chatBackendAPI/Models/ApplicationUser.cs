using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace chatBackendAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Column(TypeName = "nvarchar(150)")]
        public string FirstName { get; set; } = "";

        [Column(TypeName = "nvarchar(150)")]
        public string LastName { get; set; } = "";

        public bool IsOnline { get; set; }
    }
}