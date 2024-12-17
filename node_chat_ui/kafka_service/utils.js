const dotenv = require("dotenv")
dotenv.config()

const queueing_data = async (producer, data) =>{
    console.log(data)
    const messages = [{key: "key1", value:data }];
    await producer.send(process.env.KAFKA_BROKER_TOPIC_NAME, messages);
}

module.exports = {queueing_data}