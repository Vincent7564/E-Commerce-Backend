const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  address: String,
  phone: String,
  token : String,
  isActive : Boolean,
  expirationTime:Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
