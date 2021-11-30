const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionHistorySchema = new Schema({
    customerID: String,
    productID: String,
    orderID: String,
    amount: Number,
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = TransactionHistory = mongoose.model("transactionHistory", TransactionHistorySchema);
