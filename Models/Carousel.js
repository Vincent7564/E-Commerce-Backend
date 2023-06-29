const mongoose = require('mongoose');

const CarouselSchema = new mongoose.Schema({
    carouselImage : String,
    link: String,
})