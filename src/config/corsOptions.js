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
};

module.exports = corsOptions;
