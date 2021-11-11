const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1wmci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db('lens_finder');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');

        //GET products api
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        //GET single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        });

        //POST Orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order);
            const result = await ordersCollection.insertOne(order);
            // console.log(result);
            res.json(result);
        });

        //GET Order api
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello lens finder!')
});

app.listen(port, () => {
    console.log(`listening at ${port}`);
});