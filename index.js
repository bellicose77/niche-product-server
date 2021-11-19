const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const port = process.env.PORT || 5000;

// Middel ware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lt5tb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log("database connect sucessfully");
        const database = client.db("CarDetails");
        const details = database.collection("details");
        const usersCollection = database.collection("users");
        const reviewsCollection = database.collection('reviews');
        const blogsCollection = database.collection('blogs');
        const orderCollection = database.collection('order')


        //GET api of all products
        app.get('/details', async (req, res) => {

            const cursor = details.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //GET single products
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await details.findOne(query);
            res.json(result)
        });

        app.get('/orders', async (req, res) => {
            const email = req.body;
            const orders = await orderCollection.find({}).toArray();
            res.json(orders);
        });

        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;

            // console.log('email', req.body)
            const query = { email: email };
            const orders = await orderCollection.find(query).toArray();
            res.json(orders)
        })

        // get review
        app.get('/reviews', async (req, res) => {
            const reviews = await reviewsCollection.find({}).toArray();
            res.json(reviews);
        });

        // for getting blog data
        app.get('/blogs', async (req, res) => {
            const blogs = await blogsCollection.find({}).toArray();
            res.json(blogs);
        })


        //check admin

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            // console.log(email)
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }

            res.json({ admin: isAdmin });

        });

        //Post api to send car details to database
        app.post('/details', async (req, res) => {
            const detail = req.body;
            console.log("hiting the server", detail);
            const result = await details.insertOne(detail);
            res.json(result)
        });
        //update package 

        app.put('/details/:id', async (req, res) => {
            const id = req.params.id
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updateProduct.name, description: updateProduct.description, price: updateProduct.price, img: updateProduct.img

                },
            };

            const result = await productsCollection.updateOne(filter, updateDoc, option);

            console.log('updating', id);

            res.json(result);

        })

        // save user
        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log('user',req.body)
            const result = await usersCollection.insertOne(user);
            // console.log(result);

            res.json(result);

        });
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        });

        app.post('/book', async (req, res) => {
            const book = req.body;
            const result = await orderCollection.insertOne(book);
            res.json(result);
        });

        // for blog data
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
            res.json(result);
        });

        // make user admin
        app.put('/users/admin', async (req, res) => {
            const email = req.body.email;

            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' }
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        app.patch('/confirmation/:id', async (req, res) => {
            const id = req.params.id;
            const updateDoc = {
                $set: {
                    status: 'Shipped',
                }
            };
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.updateOne(query, updateDoc);
            res.json(result.modifiedCount)
        })

        // delete product

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);

            console.log(result)
            // res.send('hitting the server')
            res.json(result);
        });

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result.deletedCount);
        });




    }
    finally {

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("hello world");
});

app.listen(port, () => {
    console.log("Example app listening at http://localhost:", port)
})