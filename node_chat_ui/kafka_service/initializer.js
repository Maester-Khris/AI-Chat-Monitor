const {Kafka} = require("kafkajs")
const dotenv = require("dotenv")
dotenv.config()

let kafkabroker = `${process.env.KAFKA_BROKER_HOST}:${process.env.KAFKA_BROKER_PORT}`
const kafkaConfig = {
    clientId: process.env.KAFKA_BROKER_CLIENTID,
    brokers: [kafkabroker],
};

const kafkaConnection = new Kafka(kafkaConfig);
module.exports = kafkaConnection;