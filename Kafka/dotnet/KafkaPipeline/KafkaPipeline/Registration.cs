using Confluent.Kafka;
using KafkaPipeline.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KafkaPipeline
{
    public class Registration : IProducerConsumer
    {
        public Task Consume(string topic)
        {
            return new TaskFactory().StartNew(() =>
            {
                var consumerConfig = new ConsumerConfig
                {
                    BootstrapServers = "localhost:9092",
                    GroupId = "my-group",
                    AutoOffsetReset = AutoOffsetReset.Earliest
                };

                using (var consumer = new ConsumerBuilder<string, string>(consumerConfig).Build())
                {

                    consumer.Subscribe(topic);

                    while (true)
                    {

                        var consumeResult = consumer.Consume();
                        Console.WriteLine($"Consumed message '{consumeResult.Message.Value}' at: '{consumeResult.TopicPartitionOffset}'.");

                        var results = consumeResult.Message.Value.Split(",");
                        var subject = Int32.Parse(results[0]);
                        var student = Int32.Parse(results[1]);

                        using (var db = new MyDbContext())
                        {

                            var r = db.GroupMembers.Where(m => m.UserId == student && m.GroupId == subject);
                           
                            var registrations = r.ToList();

                            if (registrations.Any())
                            {
                                Output.ReturnOutput("Registration already exists");
                                this.Produce("synchro", "Fail");

                            }
                            else
                            {
                                //Output.ReturnOutput("Success");
                                this.Produce("synchro", "Success");
                            }
                        }

                    }
                }
            });
        }

        public Task Produce(string topic, string message)
        {
            return new TaskFactory().StartNew(() =>
            {
                var config = new ProducerConfig { BootstrapServers = "localhost:9092" };
                using (var producer = new ProducerBuilder<string, string>(config).Build())
                {
                    producer.Produce(topic, new Message<string, string> { Key = "key", Value = message });
                    producer.Flush();
                }
            });
        }
    }
}
