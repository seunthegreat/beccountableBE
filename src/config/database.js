const mongoose = require("mongoose");
require("dotenv").config();

const uri= `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@beccountable.zjrgiop.mongodb.net/?retryWrites=true&w=majority`

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
          useUnifiedTopology: true,
          useNewUrlParser: true
      });
  } catch (err) {
      console.error('Issue with Database connection. Error: ',err);
  }
}

module.exports = connectDB;

  
  