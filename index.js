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