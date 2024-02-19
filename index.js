const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
// app.use(cors());
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));

// const corsOptions = {
//     origin: "http://localhost:5173"
//   };

// app.use(cors(corsOptions));
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173")
//   })
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toy Server is Running.");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6khd2rb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    //  client.connect();

    const galleryCollection = client.db("toyDB").collection("toyGallery");
    const productCollection = client.db("toyDB").collection("toyProducts");

    // Gallery
    app.get("/gallery", async (req, res) => {
      try {
        const result = await galleryCollection.find().limit(21).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    });

    // Product
    app.get("/products", async (req, res) => {
      try {
        const result = await productCollection.find().limit(20).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get("/getToyByText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await productCollection
        .find({
          $or: [
            { title: { $regex: text, $options: "i" } },
            { category: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    app.post("/add-toy", async (req, res) => {
      const body = req.body;
      const result = await productCollection.insertOne(body);
      if (result?.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "can not insert try again leter",
          status: false,
        });
      }
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          toyName: body.toyName,
          price: body.price,
          imgUrl: body.imgUrl,
          category: body.category,
          reating: body.reating,
          quantity: body.availableQuantity,
          detail: body.detail,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/my-toys/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const myToys = await productCollection
        .find({ sellereEmail: email })
        .toArray();
      res.send(myToys);
    });

    // Marvel Api:-
    app.get("/marvel", async (req, res) => {
      try {
        const marvelData = await productCollection
          .find({ category: "Marvel" })
          .toArray();
        res.send(marvelData);
      } catch (error) {
        console.error("Error fetching Marvel data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // DC Comics Api:-
    app.get("/dc-comics", async (req, res) => {
      try {
        const dcData = await productCollection
          .find({ category: "DC Comics" })
          .toArray();
        res.send(dcData);
      } catch (error) {
        console.error("Error fetching Marvel data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Transformers Api:-
    app.get("/transformers", async (req, res) => {
      try {
        const transformersData = await productCollection
          .find({ category: "Transformers" })
          .toArray();
        res.send(transformersData);
      } catch (error) {
        console.error("Error fetching Marvel data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Star Wars Api:-
    app.get("/star-wars", async (req, res) => {
      try {
        const starWarsData = await productCollection
          .find({ category: "Star Wars" })
          .toArray();
        res.send(starWarsData);
      } catch (error) {
        console.error("Error fetching Marvel data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Toy Shop Server Is Running On Port : ${port}`);
});
