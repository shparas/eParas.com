const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');

var mongoConfig = JSON.parse(fs.readFileSync('mongo_config.json', 'utf8'));
const dbName = encodeURIComponent(mongoConfig.dbName);
const user = encodeURIComponent(mongoConfig.user);
const pass = encodeURIComponent(mongoConfig.pass);
const authMechanism = 'DEFAULT';

// Connection URL
const url = `mongodb://${user}:${pass}@localhost:27017/${dbName}?authMechanism=${authMechanism}`;

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  client.close();
});