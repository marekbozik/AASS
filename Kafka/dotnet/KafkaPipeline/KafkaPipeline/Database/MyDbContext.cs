using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X509;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KafkaPipeline.Database
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        public MyDbContext()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("Server=aws.connect.psdb.cloud;Database=ais;user=6an9exq91jm3ebbi7zro;password=pscale_pw_uZHsSNsDGes6JxpiGrmMkfEdf34xfVGG64xOXVOF48J;SslMode=VerifyFull;");
        }

        public DbSet<User> User { get; set; }
        public DbSet<Group> Group { get; set; }
        public DbSet<GroupMembers> GroupMembers { get; set; }


        //public DbSet<Order> Orders { get; set; }
    }
}
