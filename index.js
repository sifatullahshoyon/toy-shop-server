const express = require('express');
require("dotenv").config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6khd2rb.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const galleryCollection = client.db("toyDB").collection("toyGallery");
    const productCollection = client.db('toyDB').collection('toyProducts');

    // Gallery
    app.get('/gallery' , async(req,res) => {
        try {
            const result = await galleryCollection.find().limit(21).toArray();
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // Product
    app.get('/products' , async(req,res) => {
        try {
            const result = await productCollection.find().toArray();
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // Marvel Api:-
    app.get('/marvel' , async(req,res) => {
        try {
            const marvelData = await productCollection.find({category : 'Marvel'}).toArray();
            res.send(marvelData);
        } catch (error) {
            console.error('Error fetching Marvel data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // DC Comics Api:-
    app.get('/dc-comics' , async(req,res) => {
        try {
            const dcData = await productCollection.find({category : 'DC Comics'}).toArray();
            res.send(dcData);
        } catch (error) {
            console.error('Error fetching Marvel data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port , () => {
    console.log(`Toy Shop Server Is Running On Port : ${port}`);
});