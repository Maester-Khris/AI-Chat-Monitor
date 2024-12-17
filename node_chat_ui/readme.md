# optimisation method
- login moved under "/rooms" path
- form: detect rising error: csrf token mismatch, auto reload the form and ask to submit again
- session: auto session desctruction for both user and chat
- implement redis persistence: https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/
- automatic persitence can be handled at production level with redis docker configuration by 
    attaching and mounting a redis data folder to the container
    * on live server edit redis.conf file: 
    * locate the section that handle RDB vs AOF persistence
    * example appendonly directive from no to yes
- think more about : chat url, room identification, websocket both parties location
- messages have uuid that how we find them and update the tag
- does the django websocket send to everybody in the room ?

list all topics
    sudo docker-compose exec kafka kafka-topics.sh --list --bootstrap-server localhost:9092

    consumer
    docker-compose exec kafka kafka-console-consumer.sh --topic baeldunglinux --from-beginning --bootstrap-server kafka:9092

    producer
    docker-compose exec kafka kafka-console-producer.sh --topic baeldunglinux --broker-list kafka:9092