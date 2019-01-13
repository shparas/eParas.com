const logLocal = true;
const showServedPath = 1;	// Not implemented currently, logs what was served for current request
const usePagesDir = true;	// if you don't wanna use pages for html pages, put all web contents inside pages
const homePages = ["index.html", "home.html"];	// What to consider homepage inside pages
const defaultNotFound = "unexpected.html";
const logFileName = "requestsLog.txt";

/////////////////////////////////////////////////////////////
// Try not not change anything down here without knowledge //

var fs = require('fs');

var express = require('express');
var router = express.Router();

var path = require('path');
var hostname = path.basename(__dirname);
var cwd = `./hosts/${hostname}`;

// gateway function for hosts
router.use(function(req, res, next) {
	if (hostname != req.everythingElse && hostname != req.hostname)
		next('router');	
	else
		next();
});

// logging into the local log file, only if logLocal is True
if (logLocal == true) {
	router.use((req, res, next) => {
		var logFile = `${cwd}/logs/${logFileName}`;
		fs.appendFile(logFile, req.log + '\r\n', function (err) { if (err) console.log("Couldn't log.", err);});
		next();
	});
}

//allowing CORS for eparas.com and www.eparas.com
router.use(function(req, res, next) {
  var allowedOrigins = ['eparas.com', 'www.eparas.com'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
		res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});
// serving static files from public directory (syles, scripts, images, file...)
router.use(express.static(`${cwd}/public`));

// use routers/router.js as our main router
// if more router, manage it at router.js
if (fs.existsSync(`${cwd}/routes/router.js`))
	router.use(require(`./routes/router`));

// for page at '/' only that wasn't handled by custom routers
var homePage = "";	// default
for (var i = 0; i < homePages.length; i++){
	if (fs.existsSync(`${cwd}/public/${homePages[i]}`)) {
		homePage = `${cwd}/public/${homePages[i]}`;
		break; 		//file exists so break the loop
	}
}
if (homePage != ""){
	router.use('/$/', function(req, res){
		res.status(200).sendFile(homePage, {root: "./"});
	});
}
	
// for lost page or anything anything else not handled above
if (fs.existsSync(`${cwd}/public/${defaultNotFound}`)){
	router.all("*", function(req,res) {
		res.status(404).sendFile(`${cwd}/public/${defaultNotFound}`, {root: "./"});
	});
} else {
	router.all("*", function(req,res) {
		res.status(404).send('Content not found!');
	});
}

/////////////////////// DONE  \\\\\\\\\\\\\\\\\\\\\\

socket = require(`./socket.js`);	// since this is used right here and all others before is used in the app.js
module.exports = {router: router, socket: socket}
