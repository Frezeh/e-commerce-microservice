const express = require("express");
const app = express();
const PORT = 3001;
const mongoose = require("mongoose");
const Order = require("./Order");
const amqp = require("amqplib");
const authenticate = require("./autenticate");

var newOrder;
var channel, connection;

mongoose.connect(
  "mongodb://localhost:27017/order-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Order-Service DB Connected`);
  }
);

app.use(express.json());

function createOrder(products, customerID) {
  let total = 0;
  for (let t = 0; t < products.length; ++t) {
    total += products[t].price;
  }
  newOrder = new Order({
    products,
    customerID: customerID,
    amount: total,
  });
  newOrder.save();
  return newOrder;
}

async function connect() {
  try {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
  } catch (error) {
    console.log(error);
  }
}

connect();

app.post("/order", authenticate, async (req, res) => {
  try {
    const service = await channel.consume("ORDER", async (data) => {
      console.log("Consuming ORDER service");
      const { products, customerID } = await JSON.parse(data.content);
      newOrder = createOrder(products, customerID);
      channel.ack(data);

      channel.sendToQueue("PAYMENT", Buffer.from(JSON.stringify(newOrder)));
    });
    console.log(service.consumerTag);
    return res.status(200).send(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`Order-Service is running at ${PORT}`);
});

module.exports = app;
