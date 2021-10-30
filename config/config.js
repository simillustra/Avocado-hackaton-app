require('dotenv').config();

let CONFIG = {};

// Current ENV
CONFIG.current_env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

// Port
CONFIG.port = process.env.PORT ? process.env.PORT : '5000';

// Database
CONFIG.mongodb_uri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_PRODUCTION : process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://127.0.0.1:27017/avocado';

// JWT
CONFIG.jwt_secret_key =
   process.env.JWT_SECRET_KEY ?  process.env.JWT_SECRET_KEY: 'this@recreateSOMTHINGthatIthougthWaiswe!@#$%^&*()';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION ? process.env.JWT_EXPIRATION : '1d';

// Mailgun
CONFIG.SMTP_HOST = process.env.SMTP_HOST || '';
CONFIG.SMTP_USER = process.env.SMTP_USER || '';
CONFIG.SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
CONFIG.SMTP_PORT = process.env.SMTP_PORT || '';

module.exports = CONFIG;

// module.exports = {
//    development: {

//    },
//    test: {

//    },
//    production: {

//    }
// }
