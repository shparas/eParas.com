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
const url = `mongodb://${user}:${pass}@localhost:27017/${dbName}?authMechanism=${authMechanism}`;
const client = new MongoClient(url, { useNewUrlParser: true });




// Firsttime Config
client.connect((err, db) => {
	assert.equal(null, err);
	db.createUser({
		user: user,
		pwd: pass,
		roles: ["readWrite", "dbAdmin"]
	}, function(err, result){
      
  });
	db.createCollection("userLogin", function(err, result) {
		assert.equal(null, err);
		console.log("Collection is created!");
		db.close();
	});
});

