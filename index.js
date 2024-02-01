const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const password = "BakqtSXPisW4Yl51";
const uri = "mongodb+srv://vegetableCEO:BakqtSXPisW4Yl51@cluster0.a4tju1x.mongodb.net/vegetableShop?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// client.connect(err => {
//     const collection = client.db("vegetableShop").
//     collection("products");
//     console.log("Database Connected!!!");
//     // Performs action on the collection object
  
//     // client.close();
// });

const productCollection = client.db("vegetableShop").collection("products");
async function run() {
  try {
  
    await client.connect();
 
    // await client.db("vegetableShop").command({ ping: 1 });
   
    await productCollection;
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
   
  } finally {
    client.connect(err => {
          const collection = client.db("vegetableShop").
          collection("products");
          console.log("Database Connected!!!");
          // Performs action on the collection object
        
          // client.close();
      });
   
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/products', async (req, res) => {
  try {
    // Initialize productCollection
    // const productCollection = client.db("vegetableShop").collection("products");
    
    // Find all documents in the collection
    const docs = await productCollection.find({}).toArray();
    res.send(docs);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add a route to handle POST requests to /addProduct
app.post('/addProduct', async (req, res) => {
  try {
    const { name, price, quantity } = req.body; // Assuming your request body has productName and price
    // const productCollection = client.db("vegetableShop").collection("products");
    
    // Example: Inserting a new product into the collection
    await productCollection.insertOne({ name, price, quantity });

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('product/:id', (req, res) => {
  productCollection.findOne({_id:ObjectId(req.
    params.id)}
    .toArray((err,documents)=>{
        console.log(documents);
        req.send(documents[0]);
    })
    )})

app.patch('product/:id', (req, res) => {
    productCollection.updateOne({ _id:ObjectId(req.
      params.id)}, {
        $set:{name: req.body.name, price: req.body.price, quantity:req.body.quantity}
      })
      .then(result => {
        res.send(result.modifiedCount>0);
      });
})

app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({ _id: ObjectId(req.params.id)})
    .then(result=> {
        res.send(result.deletedCount > 0)
    })
  });

app.listen(process.env.PORT || 3000);
