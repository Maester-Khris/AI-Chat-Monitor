const lusca = require('lusca');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

const luscaConfig = lusca({
    csrf: true,
    csp: {
        policy: {
          'default-src': "'self' localhost",
          'font-src':"'self' cdn.jsdelivr.net unpkg.com",
          'style-src': "'self' 'unsafe-inline' cdn.jsdelivr.net unpkg.com",
          'script-src':"'self' 'unsafe-inline' cdn.jsdelivr.net unpkg.com",
          'connect-src':" 'self' ws://127.0.0.1:8000",
          'img-src': '*'
        }
    },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {maxAge: 31536000, includeSubDomains: true},
    xssProtection: true
});

const userSession = session({
    secret: 'userSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { name: 'user.sid' }
});

const getredisSession = (redisclient) =>{
    let rdsession = session({
        store: new RedisStore({ client: redisclient }),
        secret: 'mysecret',
        resave: false,
        saveUninitialized: true,
        cookie: { name: 'redis.sid', path: '/rooms'}
    });
    return rdsession;
}


module.exports = {userSession, getredisSession, luscaConfig};