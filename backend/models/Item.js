const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    name: String,
    description: String, 
    price: { type: Number, default: 0.00 },
    available: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = {
    ItemModel
}