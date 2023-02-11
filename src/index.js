require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const router = require("./router.js");

//--defining the Express app--//
const app = express();

// defining an array to work as the database (temporary solution)
const prompts = [
  {secret: process.env.OPENAI_API_KEY}
];

//-- adding Helmet to enhance your Rest API's security--//
app.use(helmet());

//--using bodyParser to parse JSON bodies into JS objects--//
app.use(bodyParser.json());

//--enabling CORS for all requests--//
app.use(cors());

app.use(router);

//--defining an endpoint to return all ads--//
app.get('/get-prompts', (req, res) => {
  res.send(prompts);
});  

//--starting the server--//
app.listen(3001, () => {
  console.log('listening on port 3001');
});