// Prepare necessary pre-requisites
const express = require('express');
const cors = require('cors');
const os = require("os");
// var mongo = require('mongodb'); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const http = require('http');

// Collect database settings from environment variables
const mongoHost = process.env.database_host || '127.0.0.1';
const mongoPort = process.env.database_port || 27017;
const mongoDatabase = process.env.database_name || 'wishes';
const mongoUser = process.env.database_user;
const mongoPassword = process.env.database_password;
const mongoURL = process.env.mongo_url;
//const mongoCollection = process.env.database_collection;

// const mongoDatabase = "wishes";
const mongoCollection = "questions";

// Build MongoDB connection string
//================================
// Used for OpenShift environment
if (mongoURL) {
    var url = mongoURL
} else if (mongoUser) {
    var url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
} else {
    var url = "mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
}

// Used for local testing

console.log("MongoDB instance is at: " + url)

// Set Express.js to listen for all connections
const app = express();
const port = 8080;
const hostname = "0.0.0.0";

// Adding useful components for allowing JSON access
app.use(express.json());
app.use(cors());

// Basic response on /
app.get('/', (req, res) => {
    res.send("ok");
})

// Healthcheck on /healthz
app.get('/healthz', (req, res) => {
    res.send('ok');
})

// Shows the URL of the MongoDB instance
app.get('/url', (req, res) => {
    res.send(url);
})

// Searches performance collection using query modifier from HTTP query
// Should not be used publicly
app.get('/findall', (req, res) => {
    const client = new MongoClient(url);
    console.log("connection created");
    async function findall() {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.find().toArray();
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        res.send(result);
    }

    findall().catch(console.dir);
})

// Deploy web server and log status
app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
})