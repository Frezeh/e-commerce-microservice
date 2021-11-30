const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 3003;
const mongoose = require("mongoose");
const TransactionHistory = require("./transactionHistory");
const authenticate = require("./autenticate");
const amqp = require("amqplib");

let channel, connection;

mongoose.connect(
  "mongodb://localhost:27017/payment-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Payment-Service DB Connected`);
  }
);

app.use(express.json());

async function connect() {
  try {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PAYMENT");
  } catch (error) {
    console.log(error);
  }
}

connect();

app.post("/payment", authenticate, async (req, res) => {
  try {
    channel.consume("PAYMENT", async (data) => {
      console.log("Consuming PAYMENT service");
      const order = await JSON.parse(data.content);
      const customerID = order.customerID;
      const productID = order.products[0]._id;
      const orderID = order.orderID;
      const amount = order.amount;

      const newTransactionHistory = new TransactionHistory({
        customerID,
        productID,
        orderID,
        amount,
      });
      newTransactionHistory.save();
      channel.ack(data);
    });
    return res.status(200).send("Payment posted successful")
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`Payment-Service is running at ${PORT}`);
});

module.exports = app;
