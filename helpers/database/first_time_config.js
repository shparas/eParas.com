const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');

// reading from config file
var mongoConfig = JSON.parse(fs.readFileSync('mongo_config.json', 'utf8'));
const dbName = encodeURIComponent(mongoConfig.dbName);
const user = encodeURIComponent(mongoConfig.user);
const pass = encodeURIComponent(mongoConfig.pass);
const authMechanism = 'DEFAULT';

// Creating client with connection URL
const url = `mongodb://localhost:27017/${dbName}`;
const client = new MongoClient(url, { useNewUrlParser: true });







// Use connect method to connect to the Server
client.connect(function(err, db) {
  assert.equal(null, err);
  // console.log("Connected correctly to server");
	
	db.createCollection("userLogin", function(err, result) {
        assert.equal(null, err);
        console.log("Collection is created!");
        db.close();
    });
});




  client.close();
});



function signup(info){
	
}