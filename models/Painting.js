const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * No ID cause mongo will auto assign
 */
const PaintingSchema = new Schema({
    name: String,
    url: String,
    techniques: String
})
module.exports = mongoose.model('Painting', PaintingSchema)
