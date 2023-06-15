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
  exposedHeaders: ['Content-Type', 'Access-Control-Allow-Origin'], // Add 'Access-Control-Allow-Origin' to exposed headers
  allowedHeaders: ['Content-Type', 'Authorization', '*'], // Include 'Authorization' header
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

module.exports = corsOptions;
