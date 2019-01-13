var crypto = require('crypto');

var hash = function(password) {
  return crypto.createHash('sha1').update(password).digest('base64')
};
var quickLog = function(x){
	console.log("-- Logged at point", x);
};

module.exports = {
	hash: hash,
	log: quickLog,
}
