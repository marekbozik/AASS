using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KafkaPipeline
{
    public interface IProducerConsumer
    {
        public Task Produce(string topic, string message);
        public Task Consume(string topic);

    }
}
