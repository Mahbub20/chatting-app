using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using chatBackendAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace chatBackendAPI.Data
{
    public class ChatDbContext : IdentityDbContext
    {
        public ChatDbContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        public DbSet<Message> Messages { get; set; }
    }
}