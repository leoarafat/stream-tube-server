const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tjc9clz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const songsCollection = client.db("catClicker").collection("songs");
const moviesCollection = client.db("catClicker").collection("movies");

async function catsRun() {
  try {
    //find songs
    app.get("/songs", async (req, res) => {
      const query = {};
      const result = await songsCollection.find(query).toArray();
      res.send(result);
    });
    //find songs with id
    app.get("/songs/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        // check if id is a valid ObjectId
        return res.status(400).send("Invalid ID.");
      }
      const query = { _id: new ObjectId(id) };
      const result = await songsCollection.findOne(query);
      if (!result) {
        // handle case where no cat is found with the given ID
        return res.status(404).send("Songs not found.");
      }
      res.send(result);
    });
    //find movies
    app.get("/movies", async (req, res) => {
      const query = {};
      const result = await moviesCollection.find(query).toArray();
      res.send(result);
    });
    //find movies with id
    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        // check if id is a valid ObjectId
        return res.status(400).send("Invalid ID.");
      }
      const query = { _id: new ObjectId(id) };
      const result = await moviesCollection.findOne(query);
      if (!result) {
        // handle case where no cat is found with the given ID
        return res.status(404).send("Movies not found.");
      }
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}
catsRun().catch((error) => {
  console.log(error);
});
//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
