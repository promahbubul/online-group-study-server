const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = 3000;

const app = express();

// middleware
app.use(cors());
app.use(morgan());
app.use(express.json());

const uri =
  "mongodb+srv://onlineGroupStudy:onlineGroupStudy@cluster0.xmhqmx1.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const assignmentCollection = client
      .db("onlineStudyGroup")
      .collection("assignments");

    const submitedAssignmentCollection = client
      .db("onlineStudyGroup")
      .collection("submitedAssignment");

    app.get("/api/v1/assignments", async (req, res) => {
      const result = await assignmentCollection.find().toArray();
      res.send(result);
    });

    app.delete("/api/v1/delete-assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/api/v1/assignment", async (req, res) => {
      const assignment = req.body;
      const result = await assignmentCollection.insertOne(assignment);
      res.send(result);
    });

    app.put("/api/v1/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateAssignment = req.body;
      const result = await assignmentCollection.updateOne(query, {
        $set: updateAssignment,
      });
      res.send(result);
      console.log(result);
    });

    app.get("/api/v1/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    });

    app.post("/api/v1/submit-assignment/", async (req, res) => {
      const submitedAssignment = req.body;
      const result = await submitedAssignmentCollection.insertOne(
        submitedAssignment
      );
      console.log(result);
      res.send(result);
    });

    // var a = "mahbub"
    // console.log(a)

    // app.get("/api/v1/submited-assignment", async (req, res) => {

    // });

    app.get("/api/my-assignment/:user", async (req, res) => {
      const userEmail = req.params.user; // mahbublalam500@gmail.com
      const query = { user: userEmail };
      const result = await submitedAssignmentCollection.find(query).toArray();

      res.send(result);
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

app.get("/", (req, res) => {
  res.send("Server running ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
