// db.js
const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://transchain24:transchain24@transchain-cluster.vyuaug6.mongodb.net/TransChain';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = client;
