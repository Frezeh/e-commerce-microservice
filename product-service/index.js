const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 3002;
const mongoose = require("mongoose");
const Product = require("./Product");
const amqp = require("amqplib");
const authenticate = require("./autenticate");

let channel, connection;

app.use(express.json());
mongoose.connect(
    "mongodb://localhost:27017/product-service",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log(`Product-Service DB Connected`);
    }
);

async function connect() {
    try {
        const amqpServer = "amqp://localhost:5672";
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("PRODUCT");
    } catch (error) {
        console.log(error);
    }
}
connect();

app.post("/product/buy/:id", authenticate, async (req, res) => {
    const { ids } = req.body;
    try {
        let products = await Product.find({ _id: { $in: ids } });
        channel.sendToQueue(
            "ORDER",
            Buffer.from(
                JSON.stringify({
                    products,
                    customerID: req.params.id,
                })
            )
        );
        return res.status(200).send("Product purchased and added to order successfully");

    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
});

app.post("/product/create", authenticate, async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newProduct = new Product({
            name,
            description,
            price,
        });
        newProduct.save();
        return res.status(201).send(newProduct);

    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
});


app.listen(PORT, () => {
    console.log(`Product-Service is running at ${PORT}`);
});

module.exports = app;