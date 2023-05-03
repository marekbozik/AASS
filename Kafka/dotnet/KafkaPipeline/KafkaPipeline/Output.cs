using Confluent.Kafka;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KafkaPipeline
{
    public class Output
    {
        public static void ReturnOutput(string message)
        {
            
                var config = new ProducerConfig { BootstrapServers = "localhost:9092" };
                using (var producer = new ProducerBuilder<string, string>(config).Build())
                {
                    producer.Produce("result", new Message<string, string> { Key = "key", Value = $"{message}" });
                    producer.Flush();
                }

        }
    }
}
