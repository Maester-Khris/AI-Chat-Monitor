const express = require("express")
const path = require("path")
const redis = require("redis")
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser');
const chatroute = require("./router/chatrouter")
const testroute = require("./router/testrouter")
const staticroute = require("./router/staticroute")
const redisManager = require("./databases/redis_manager")
const KafkaProducer = require('./kafka_service/kafka_producer')
const {luscaConfig, userSession, getredisSession} = require('./config')


/**
 * Application general configuration 
 * listening port
 * view template engine
 * static asset loading
*/
dotenv.config()
const app = express()
const port = process.env.PORT || 3000
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use('/assets', express.static(path.join(__dirname, 'views', 'assets')))


/**
 * ========= Third party system intialization and test =========
 * Redis server for session store
 * Kafka producer for message queuing
*/
const redisClient = redisManager.getRedisClient();
const kafkaproducer = new KafkaProducer();
let kafka_topics_available = true
redisManager.testConnection();
try {
    kafkaproducer.producer.connect().then();
} catch (error) {
    kafka_topics_available = false
    console.log("something went wrong when connecting to kafkabroker")
}

/**
 * ========= Application configuration with midlleware ===========
 * session middleware
 * web data parsing: json, cookie, form
 * express user session creation
 * Lusca security: csrf, xss, conte security policy(csp)
*/
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/rooms',getredisSession(redisClient));
app.use(userSession);
app.use(luscaConfig);



/**
 * ============= Application Launching on server ============
 * web routing 
 * app listening and ready 
*/ 
app.use('',staticroute)
app.use('/api/test',testroute)
app.use('/rooms',chatroute(kafkaproducer.producer, redisClient))

app.listen(port,()=>{
    console.log("the application is live and listening to the port: ",port)
})


/**
 * =============== Testing or debugging purpose only ============
    // code used to test kafka production
    // let testkafka = async() =>{
    //     const queu_message = [{value: JSON.stringify({message:"hello from multi broker", room:"123"})}];
    //     await kafkaproducer.producer.connect();
    //     await kafkaproducer.producer.send({topic: process.env.KAFKA_BROKER_TOPIC_NAME, messages:queu_message});
    // }
    // testkafka();
*/