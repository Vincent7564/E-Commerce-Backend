const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace the connection string with your MongoDB Atlas connection string or local MongoDB URL
    await mongoose.connect('mongodb://127.0.0.1:27017/vnv', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with a non-zero status code
  }
};

module.exports = connectDB;
