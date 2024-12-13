// Prepare necessary pre-requisites
const express = require('express');
const cors = require('cors');
const os = require("os");
// var mongo = require('mongodb'); 
const { MongoClient } = require('mongodb');
const http = require('http');

// Collect database settings from environment variables
const mongoHost = process.env.database_host || '127.0.0.1';
const mongoPort = process.env.database_port || 27017;
//const mongoDatabase = process.env.database_name;
const mongoUser = process.env.database_user;
const mongoPassword = process.env.database_password;
//const mongoCollection = process.env.database_collection;

const mongoDatabase = "wishes";
const mongoCollection = "wishes";

// Build MongoDB connection string
//================================
// Used for OpenShift environment
if (mongoUser) {
    var url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
} else {
    var url = "mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
}
// Used for local testing
// var url = "mongodb://127.0.0.1:27017"
// var url = "mongodb+srv://andrew:Fdpgz9Cf@cluster0.xahhl.mongodb.net/?retryWrites=true&w=majority";
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

    findall(req.query).catch(console.dir);
})

// Insert a single document into the collection, passed as a JSON string
// No checks on formatting are included
// This is the GET request - probably not needed (document attached to 'query' parameter)
app.get('/insert', (req, res) => {
    const client = new MongoClient(url);
    console.log("connection created");
    
    async function insertwishget(entry) {
        console.log("Inserting: " + JSON.stringify(entry));
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.insertOne(entry);
            console.log("insert completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("insert result:");
        console.log(result);
        res.send(result);
    }

    insertwishget(req.query).catch(console.dir);
})

// Insert a single document into the collection, passed as a JSON string
// No checks on formatting are included
// This is the POST request - the whole body object is used
app.post('/insert', (req, res) => {
    const client = new MongoClient(url);
    console.log("connection created");

    async function insertwishpost(entry) {
        console.log("Inserting: " + JSON.stringify(entry));
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.insertOne(entry);
            console.log("insert completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("insert result:");
        console.log(result);
        res.send(result);
    }

    insertwishpost(req.body).catch(console.dir);
})

// Deploy web server and log status
app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
})