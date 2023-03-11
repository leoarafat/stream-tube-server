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
//data collection start
const songsCollection = client.db("catClicker").collection("songs");
const moviesCollection = client.db("catClicker").collection("movies");
const sharePostCollection = client.db("catClicker").collection("sharePost");
const shareSongPostCollection = client.db("catClicker").collection("shareSong");
const movieCommentCollection = client
  .db("catClicker")
  .collection("moviesComment");
const songCommentCollection = client.db("catClicker").collection("songComment");
//data collection end

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
    //movie like
    app.put("/movieLike/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $inc: {
          like: 1,
        },
      };
      const result = await moviesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //movie view
    app.put("/movieView/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $inc: {
          Views: 1,
        },
      };
      const result = await moviesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //songs like
    app.put("/songLike/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $inc: {
          like: 1,
        },
      };
      const result = await songsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //songs view
    app.put("/songView/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $inc: {
          Views: 1,
        },
      };
      const result = await songsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //movies comment
    app.post("/moviesComment", async (req, res) => {
      const user = req.body;
      const result = await movieCommentCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });
    // //songs comment
    app.post("/songComment", async (req, res) => {
      const user = req.body;
      const result = await songCommentCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });
    //get movie comment
    app.get("/movieComment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const result = movieCommentCollection.find(query);
      const cursor = await result.toArray();

      res.send(cursor);
    });
    //get movie comment
    app.get("/songComment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const result = songCommentCollection.find(query);
      const cursor = await result.toArray();

      res.send(cursor);
    });

    //share post
    app.post("/sharePost", async (req, res) => {
      const query = req.body;
      const result = await sharePostCollection.insertOne(query);
      res.send(result);
    });
    app.get("/sharePost", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = sharePostCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/shareSong", async (req, res) => {
      const query = req.body;
      const result = await shareSongPostCollection.insertOne(query);
      res.send(result);
    });
    app.get("/shareSong", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = shareSongPostCollection.find(query);
      const result = await cursor.toArray();
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
