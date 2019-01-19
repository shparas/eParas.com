var Imap = require('imap');

const EventEmitter = require('events');
class Emitter extends EventEmitter {}
const myEmitter = new Emitter();

/* SERVER CONFIGURATIONS */
var shparas97 = new Imap({
	user: 'shparas97@gmail.com',
	password: 'Iw2aGsrn.',
	host: 'imap.gmail.com', port: 993, tls: true
});
var shprs2 = new Imap({
	user: 'shprs2@gmail.com',
	password: 'Iw2aGsrn.',
	host: 'imap.gmail.com', port: 993, tls: true
});
var school = new Imap({
	user: 'paras.sharma@mavs.uta.edu',
	password: 'CIatosrn?',
	host: 'outlook.office365.com', port: 993, tls: true
});
var school_work = new Imap({
	user: 'paras.sharma@uta.edu',
	password: 'CIatosrn?',
	host: 'outlook.office365.com', port: 993, tls: true
});
var mail_eparas = new Imap({
	user: 'mail@eparas.com',
	password: 'Iw2aUTAs.',
	host: 'imap.zoho.com', port: 993, tls: true
});
var social_eparas = new Imap({
	user: 'social@eparas.com',
	password: 'Iw2aUTAs.',
	host: 'imap.zoho.com', port: 993, tls: true
});


/* SOME CONSTANTS */
var mailBoxes = 6;
var doneCounter = 0;
var pastDays = 1;
var unseen_number = {
	_since: pastDays
};


/* HELPER FUNCTIONS */
function passed_date_string(n){	
	var date = new Date(Date.now() - n*24*60*60*1000);
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var string_date = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
	return string_date;
}

/* ACTUAL FUNCTION */
function unseenNumber(imap, pastDays, socket){	
	imap.once('ready', function() {
		imap.openBox('INBOX', true, function(err, box) {
			if (err) throw err;
			imap.search([ 'UNSEEN', ['SINCE', passed_date_string(pastDays)] ], function(err, results) {
				if (err) throw err;
				unseen_number[imap._config.user] = results.length;
				imap.end();
			});
		});
	});
	imap.once('error', function(err) {
		unseen_number[imap._config.user] = -1; 
		console.log('Connection error for ' + imap._config.user + ': ' + err);
	});
	imap.once('end', function() {
		doneCounter++; 
		if (doneCounter >= mailBoxes){
			doneCounter = 0;
			socket.emit("newEmails", unseen_number);
		}
	});
	imap.connect();
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
socket = function(io){
	io.on('connection', function(socket){
		socket.emit('request', "Welcome"); // emit an event to the socket
		//io.sockets.emit('broadcast', "hello"); // emit an event to all connected sockets
		socket.on('reply', function(){ /* */ }); // listen to the event
		
		socket.on("checkEmails", function(){	
			unseenNumber(social_eparas, unseen_number._since, socket);
			unseenNumber(mail_eparas, unseen_number._since, socket);
			unseenNumber(shparas97, unseen_number._since, socket);
			unseenNumber(shprs2, unseen_number._since, socket);
			unseenNumber(school, unseen_number._since, socket);
			unseenNumber(school_work, unseen_number._since, socket);
		});
	});
}






module.exports=socket;