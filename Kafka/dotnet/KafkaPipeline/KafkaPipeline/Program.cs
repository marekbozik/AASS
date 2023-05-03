// See https://aka.ms/new-console-template for more information
using Confluent.Kafka;
using KafkaPipeline;


//var auth = new Auth();
//var sub = new Subject();

var nodesDict = new Dictionary<string, IProducerConsumer>()
{
    { "my-topic", new Auth() },
    { "subject", new Subject() },
    { "registration", new Registration() },
    { "register", new Register() }

};

List<Task> tasks = new List<Task>();

foreach (var node in nodesDict)
{
    tasks.Add(node.Value.Consume(node.Key));
}

Console.WriteLine("Hello, World!");

Task.WaitAll(tasks.ToArray());

//await auth.Consume(topic: "my-topic");
