const kafka = require('./initializer')

class KafkaProducer {
    constructor() {
        this.producer = kafka.producer();
    }

    async produce(topic, messages) {
        try {
            await this.producer.connect();
            await this.producer.send({
                topic: topic,
                messages: messages,
            });
        } catch (error) {
            console.error(error);
        } finally {
            await this.producer.disconnect();
        }
    }

}

module.exports = KafkaProducer;