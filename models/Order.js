const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    zip: String,
});

const orderSchema = new mongoose.Schema({
    paymentId: String,
    orderId: String,
    signature: String,
    cart: Array,
    total: Number,
    address: addressSchema,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
