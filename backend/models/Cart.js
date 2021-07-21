const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = {
    CartModel
}