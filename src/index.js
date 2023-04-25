require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require("./config/database"); 
const PORT = process.env.PORT || 3500;
const verifyJWT = require("../src/middleware/verifiyJWT");

connectDB(); //--> Connects to the database

app.use(logger); //--> custom middleware logger

//-- Handle options credentials check - before CORS!
//-- and fetch cookies credentials requirement --//
app.use(credentials)


app.use(cors(corsOptions)); //--> Cross Origin Resource Sharing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//--serve static files--//
app.use('/', express.static(path.join(__dirname, '/public')));

//-- Routers --//
const authRouter = require("./routes/authRouter");
const refreshRouter = require("./routes/refresh");
const userRouter = require("./routes/userRouter");
const partnerRouter = require("./routes/partnerRouter");


//-- adding Helmet to enhance your Rest API's security--//
app.use(helmet());

app.use('/auth', authRouter);
//app.use('/auth', refreshRouter);

app.use(verifyJWT);
app.use('/u', userRouter);
app.use('/u/p', partnerRouter);

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});