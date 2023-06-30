const mongoose = require('mongoose');

const CarouselSchema = new mongoose.Schema({
    hyperlink: String,
    image : String,
})

const Carousel = mongoose.model('Carousels', CarouselSchema);

module.exports = Carousel;