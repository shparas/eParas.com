const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const helper = require('../functions');
const events = require('events')

const log = helper.log;
const dbReady = new events.EventEmitter(); // to signal if db is ready

// reading from config file
const mongoConfig = JSON.parse(fs.readFileSync(__dirname + '/mongo_config.json', 'utf8'));
const dbName = encodeURIComponent(mongoConfig.dbName);
const user = encodeURIComponent(mongoConfig.user);
const pass = encodeURIComponent(mongoConfig.pass);
const authMechanism = 'DEFAULT';

// Creating client and db instance with connection URL
const url = `mongodb://localhost:27017`;
var db;
var client;

var connectDB = function(){
	client = new mongoClient(url, { useNewUrlParser: true });
	client.connect(function(err, conn) {
		assert.equal(null, err); // Connected correctly
		db = conn.db(dbName);
		dbReady.emit('dbReady');
		initDB();
	});
};

var closeDB = function(){
	client.close();
}
var destroyDB = function(){
	db.dropDatabase((err, res)=>{
		restartDB();
	});
};
var restartDB = function() {
	closeDB();
	dbConnect();
};
var initDB = function(){
	db.collection("userLogin").createIndex({"email": 1}, {unique: true});
	db.collection("userLogin").createIndex({"phone": 1}, {unique: true});
	db.collection("userLogin").insertOne({"_id":"5c2ed479fd3e360730c9d664","fName":"paras","lName":"sharma","zip":76013,"phone":"2083710206","email":"shps2@live.com","pass":"Hello","verfied":true}, ()=>{});
};



var addUser = function(obj, callback){
	obj.verfied = false;
	db.collection("userLogin").insertOne(obj, (err, data) => {
		if (err) callback(err, {success: false, data: data});
		else {
			callback(err, {success: true, data: data});
		}
	});
}
var retrieveLogin = function(obj, callback){
	db.collection("userLogin").findOne({$and:[{email:obj.email},{pass:obj.pass}]}, (err, data) => {
		if (err) callback(err, {success: false, data: data});
		else {
			callback(err, {success: true, data: data});
		}
	});
}
var cookieLogin = function(obj, callback){
	db.collection("userLogin").findOne({email:obj.email}, (err, data) => {
		if (err) callback(err, {success: false, data: data});
		else {
			if (data == null || helper.hash(data.pass) !== obj.pass)
				callback(err, {success: false, data: null});
			callback(err, {success: true, data: data});
		}
	});
};







connectDB();
module.exports = {
	addUser: addUser,
	retrieveLogin: retrieveLogin,
	cookieLogin: cookieLogin,
	dbReady: dbReady,
}
