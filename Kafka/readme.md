## Run docker
`docker-compose up -d`

## Create topic in kafka container
1. Navigate to `opt/kafka_2.13-2.8.1/bin`

2. Create topic `kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic my-topic`

3. Check existing topics `kafka-topics.sh --list --zookeeper zookeeper:2181`

4. Run C# code