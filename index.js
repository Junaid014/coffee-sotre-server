const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
// 
// 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.erlqeyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    //  All collection............
    const coffeeCollection = client.db('coffeeDB2').collection('coffees')
    const usersCollection = client.db('coffeeDB2').collection('users')

    app.get('/coffees', async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result)
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })

    // for my coffee section to get the specific coffees which a user upload 
    app.get('/myCart/:email', async (req, res) => {

      const result = await coffeeCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updatedDoc = {
        $set: updatedCoffee
      }
      const result = await coffeeCollection.updateOne(filter, updatedDoc, options)
      res.send(result)
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })


    // User related APIS

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("coffee server")
});
app.listen(port, () => {
  console.log(`coffee server is running  port ${port}`);
})