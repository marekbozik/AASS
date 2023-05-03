using Confluent.Kafka;
using static Confluent.Kafka.ConfigPropertyNames;

namespace CoreApiNoDocker
{
    public class Kafka
    {
        public ProducerConfig Config { get; private set; }
        public IProducer<string, string> Producer { get; private set; }

        public ConsumerConfig ConsumerConfig { get; private set; }
        public IConsumer<string, string> Consumer { get; private set; }


        public Kafka()
        {
            Config = new ProducerConfig { BootstrapServers = "localhost:9092" };
            Producer = new ProducerBuilder<string, string>(Config).Build();

            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = "localhost:9092",
                GroupId = "my-group",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };
            ConsumerConfig = consumerConfig;
            Consumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
            Consumer.Subscribe("result");

        }

        public Task RegisterSubject(int subjectId, int studentId)
        {
            return new TaskFactory().StartNew(() =>
            {
                Producer.Produce("my-topic", new Message<string, string> { Key = "key", Value = $"{subjectId},{studentId}" });
            });
        }

        public Task<string> GetResult()
        {
            return new TaskFactory().StartNew(() =>
            {
                var consumeResult = Consumer.Consume();
                return consumeResult.Message.Value;
                //Console.WriteLine($"Consumed message '{consumeResult.Message.Value}' at: '{consumeResult.TopicPartitionOffset}'.");
                //Producer.Produce("my-topic", new Message<string, string> { Key = "key", Value = $"{subjectId},{studentId}" });
            });
        }
    }
}
