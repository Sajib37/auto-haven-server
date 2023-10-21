const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const cors=require('cors')
const port = process.env.PORT || 5000

// middleWares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send(`Server is running on port : ${port}`)
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f30vajg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
      await client.connect();
      
      const productCollection= client.db("productsDB").collection("products")
      //   Post product
      app.post('/products', async (req, res) => {
          const newProduct = req.body;
          const result = await productCollection.insertOne(newProduct);
        
          res.send(result)
      })

      //   get products by brand name
      app.get('/products/:item', async (req, res) => {
          const item = req.params.item;
          const query = { brand: { $regex: new RegExp(item, 'i') } };
          const cursor = productCollection.find(query)
          const result = await cursor.toArray();
          res.send(result);
      })
    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.find(query).toArray()

      console.log(result)
      res.send(result)
    })

    // Cart collection
    const cartCollection = client.db("productsDB").collection("carts");
    // cart post by clicking cart button
    app.post('/carts', async (req, res) => {
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart)
      res.send(result)
      
    })

    // get cart from database filtering by email

    app.get('/carts/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: { $regex: new RegExp(email, 'i') } };
      const result = await cartCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    })

    // cart added product get from database filtering by id
    app.get(`/carts/cart/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query)
      res.send(result);
    })
    


    await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})


// M1QCBy1Rxc6XHu0m
// auto-haven