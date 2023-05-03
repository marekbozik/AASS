using Confluent.Kafka;
using KafkaPipeline.Database;
using Microsoft.EntityFrameworkCore;

namespace KafkaPipeline
{
    public class Register : IProducerConsumer
    {
        public Task Consume(string topic)
        {
            topic = "register";
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
                        bool failed = false;

                        //#region synchronization
                        //var consumerConfigS = new ConsumerConfig
                        //{
                        //    BootstrapServers = "localhost:9092",
                        //    GroupId = "my-group",
                        //    AutoOffsetReset = AutoOffsetReset.Earliest
                        //};
                        //using (var consumerS = new ConsumerBuilder<string, string>(consumerConfigS).Build())
                        //{
                        //    consumerS.Subscribe("synchro");
                        //    var consumeResult1 = consumerS.Consume();
                        //    var consumeResult2 = consumerS.Consume();

                        //    if (consumeResult1.Message.Value == "Success" && consumeResult2.Message.Value == "Success")
                        //    {
                        //        ;
                        //    }
                        //    else
                        //    {
                        //        failed = true;
                        //        //continue;
                        //    }

                        //}

                        //#endregion


                        var consumeResult = consumer.Consume();
                        Console.WriteLine($"Consumed message '{consumeResult.Message.Value}' at: '{consumeResult.TopicPartitionOffset}'.");

                        if (failed) { continue; }

                        var results = consumeResult.Message.Value.Split(",");
                        var subject = Int32.Parse(results[0]);
                        var student = Int32.Parse(results[1]);

                        using (var db = new MyDbContext())
                        {
                            db.Database.ExecuteSqlRaw($"INSERT INTO GroupMembers (UserId, GroupId) VALUES ({student}, {subject})");
                            //db.GroupMembers.Add(new GroupMembers { Id = 1000, GroupId = subject, UserId = student });
                            Output.ReturnOutput("Success");
                            db.SaveChanges();

                        }

                    }
                }
            });
        }

        public Task Produce(string topic, string message)
        {
            throw new NotImplementedException();
        }
    }
}
