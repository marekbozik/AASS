using Confluent.Kafka;
using KafkaPipeline.Database;
using Org.BouncyCastle.Asn1.X509;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KafkaPipeline
{
    public class Auth : IProducerConsumer
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
                        // Consume messages from the "my-topic" topic
                        var consumeResult = consumer.Consume();
                        Console.WriteLine($"Consumed message '{consumeResult.Message.Value}' at: '{consumeResult.TopicPartitionOffset}'.");

                        var results = consumeResult.Message.Value.Split(",");
                        var subject = results[0];
                        var student = Int32.Parse(results[1]);

                        using (var db = new MyDbContext())
                        {
                            var u = db.User.Where(u => u.Id == student && u.IsTeacher == false);

                            var users = u.ToList();
                            if (users.Any())
                            {
                                Console.WriteLine("FirstName == " + u.First().FirstName);
                                //parallel region
                                this.Produce("subject", consumeResult.Message.Value);
                                this.Produce("registration", consumeResult.Message.Value);

                            }
                            else
                            {
                                Output.ReturnOutput("Not student");
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
