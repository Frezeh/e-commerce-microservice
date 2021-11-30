const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    products: [
        {
            product_id: String,
        },
    ],
    customerID: String,
    amount: Number,
    orderStatus: {
        type: String,
        default: "pending"
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = Order = mongoose.model("order", OrderSchema);
