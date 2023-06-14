const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  referrerPolicy: 'no-referrer',
  credentials: true,
  crossOriginOpenerPolicy: 'allow-from',
  crossOriginResourcePolicy: 'allow-from',
  exposedHeaders: ['Content-Type'],
  allowedHeaders: ['Content-Type', 'Authorization', '*'], // Include 'Authorization' header
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: {
    'Access-Control-Allow-Origin': 'https://beccountable-frontend.vercel.app',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, *'
  }
};

module.exports = corsOptions;
