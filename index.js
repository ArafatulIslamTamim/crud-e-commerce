const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://tamim030:1234@cluster0.zwvdxyz.mongodb.net/`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client.connect((err) => {
  const productsCollection = client.db("eComm").collection("products");

  // CRUD -> Create, Read, Update, Delete

  // Create
  app.post("/create-product", async (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
    .then(result => {
        result.acknowledged && res.redirect('/')
    })
  });

  // Read
  app.get("/products", async (req, res) => {
    const result = await productsCollection.find({}).toArray();
    res.send(result);
  });

  // Update
  app.patch("/update-product/:id", async (req, res) => {
    const id = ObjectId(req.params.id);
    const name = req.body.name;
    const price = req.body.price;
    const quantity = req.body.quantity;

    await productsCollection.updateOne(
        { _id: id }, // query
        { $set: { name, price, quantity } }
    )
    .then(result => {
        result.acknowledged && res.redirect('/')
    })
  });

  // Delete
  app.delete("/delete-product/:id", async (req, res) => {
    const id = ObjectId(req.params.id);
    await productsCollection.deleteOne({ _id: id });
    res.send({
        status: 200,
        message: "Product deleted successfully"
    })
  });

  err ? console.log(err) : console.log("MongoDB Connected Successfully!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Display server running message on terminal
});
