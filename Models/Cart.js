const { Decimal128 } = require('mongodb');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    user_id : String,
    product_detail: [{
        product_id : ObjectId,
        qty : Decimal128,
    }]
})

const Cart = mongoose.model('cart', CartSchema);

module.exports = Cart;