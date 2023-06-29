const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    productName: String,
    price: Decimal128,
    description: String,
    qty: Decimal128,
    productImage: String,
    discount : Decimal128,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
