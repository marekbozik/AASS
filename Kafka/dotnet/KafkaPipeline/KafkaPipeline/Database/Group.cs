using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KafkaPipeline.Database
{
    public class Group
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int TeacherId { get; set; }
    }
}
