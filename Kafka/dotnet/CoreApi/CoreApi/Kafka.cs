using Confluent.Kafka;
using static Confluent.Kafka.ConfigPropertyNames;

namespace CoreApi;
public class Kafka
{
    public ProducerConfig Config { get; private set; }
    public IProducer<string, string> Producer { get; private set; }

    public Kafka() 
    {
        Config = new ProducerConfig { BootstrapServers = "localhost:9092" };
        Producer = new ProducerBuilder<string, string>(Config).Build();

    }

    public Task RegisterSubject(int subjectId, int studentId)
    {
        return new TaskFactory().StartNew(() =>
        {
            Producer.Produce("my-topic", new Message<string, string> { Key = "key", Value = $"{subjectId},{studentId}" });
        });
    }
}
