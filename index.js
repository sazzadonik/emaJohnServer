const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sazzadcluster.wucws.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTIONS}`);
    const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`orders`);
    console.log("Connected")

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        //console.log(product);
        collection.insertMany(product)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            });
    })

    app.get("/products", (req, res) => {
        collection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    })


    app.get("/products/:key", (req, res) => {
        collection.find({ key: req.params.key }).toArray((err, documents) => {
            res.send(documents[0])
        });
    });



    app.post("/productByKeys", (req, res) => {
        const productKeys = req.body;
        collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
            res.send(documents);
        });
    })


    app.post("/addOrder", (req, res) => {
        const order = req.body;
        //console.log(product);
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            });
    })
});



app.get("/", (req, res) => res.send("Hello world"))
app.listen(process.env.PORT || 5000);