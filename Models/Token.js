const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    username : String,
    token : String,
    isActive : Boolean,
    tokenDate : Date,
})

const Token = mongoose.model('token', TokenSchema);

module.exports = Token;