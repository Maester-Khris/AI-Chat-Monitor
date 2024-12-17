const redis = require("redis")

let redisClient;

const getRedisClient = () =>{
    if (!redisClient) {
        redisClient = redis.createClient({
            host: "localhost",
            port: 6379
        });

        // Set up connection listeners
        redisClient.on('error', (err) => {
            console.log('Could not establish a connection with Redis. ' + err);
        });
        redisClient.on('connect', () => {
            console.log('Connected to Redis successfully');
        });
    }
    return redisClient;
}
const testConnection = async () =>{
    const client = getRedisClient();
    await client.connect();
}


module.exports = {getRedisClient, testConnection};