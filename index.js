const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const port = process.env.PORT || 5000;

// Middel ware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lt5tb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

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