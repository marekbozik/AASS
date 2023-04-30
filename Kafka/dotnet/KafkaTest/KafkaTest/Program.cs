using Confluent.Kafka;
using System;

class Program
{
    static void Main(string[] args)
    {
        var config = new ProducerConfig { BootstrapServers = "localhost:9092" };
        Console.WriteLine("hello"); 

        Parallel.Invoke(() =>
        {
            // Create a Kafka producer
            using (var producer = new ProducerBuilder<string, string>(config).Build())
            {
                // Produce a message to the "my-topic" topic
                int i = 0;
                while (true)
                {
                    producer.Produce("my-topic", new Message<string, string> { Key = "key", Value = $"value{i}"});
                    Thread.Sleep(2000);
                    i++;
                    //if (i > 10)
                    //    return;
                }
            }

        },
        () =>
        {
            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = "localhost:9092",
                GroupId = "my-group",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            // Create a Kafka consumer
            using (var consumer = new ConsumerBuilder<string, string>(consumerConfig).Build())
            {
                // Subscribe to the "my-topic" topic
                consumer.Subscribe("my-topic");

                while (true)
                {
                    // Consume messages from the "my-topic" topic
                    var consumeResult = consumer.Consume();
                    Console.WriteLine($"Consumed message '{consumeResult.Message.Value}' at: '{consumeResult.TopicPartitionOffset}'.");
                    
                }
            }

        });


    }
}