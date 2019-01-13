var router = require('express').Router();
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

var hostname = path.basename(path.dirname(__dirname));
var cwd = `./hosts/${hostname}/routes`;
var viewDir = `../hosts/${hostname}/views`;	// .. since its in ./views by default
var publicDir = `./hosts/${hostname}/public`;

// Authentication not required to access these
// For one level get requests
router.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*.eparas.com");
	next();
});

router.use('/$/', function(req, res){
	res.redirect("/home");
});

router.use("/home", (req, res) => {
	var dir = `./hosts/${hostname}/public/images/carousel`;
	readDir(dir, (err, dirContent) => {
		if (err) throw err;
		var names = dirContent.files;
		if (names.length > 0)
			res.render(`${viewDir}/home.html`, {carouselNames: names});
		else 
			res.render(`${viewDir}/home.html`, {carouselNames: ""});
	});
});

router.post("/leavemessage", (req, res) => {
	var writeStr = JSON.stringify(req.body) + "\n";	
	
	fs.appendFile(`./hosts/${hostname}/public/_data/contact_messages.json`, writeStr, (err) => {
		if (err) { throw (err); }
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end('{"success" : "Received Successfully!", "status" : 200}');
	});
});



router.get("/get_file_list", (req, res) => {
	var id = req.query.id;
	if (id == undefined) id = "";
	var dir = `./hosts/${hostname}/public/_data/files/${id}`;
	readDir(dir, (err, dirContent) => {
		if (err) throw err;
		var names = dirContent.files;
		if (names.length > 0)
			res.status(200).send(JSON.stringify(names));
		else 
			res.status(404).send('Content not found!');
	});
});

router.get("/get_file_from_id_name", (req, res) => {
	var id = req.query.id;
	var name = req.query.name;
	var dir = `./hosts/${hostname}/public/_data/files/${id}/${name}`;
	if (fs.existsSync(dir)){
		res.sendFile(dir, {root: "./"});
	}
	else res.status(404).send('Content not found!');
});







router.post("/put_file", (req,res)=>{
	var form = new formidable.IncomingForm({uploadDir: `./hosts/${hostname}/public/_data/files/tmp/`, keepExtensions: true});	
	form.parse(req, function(err, fields, allFiles) {
		var files;
		
		if (allFiles['fileUpload']) files = allFiles['fileUpload'];
		else if (allFiles['0']) files = allFiles['0'];
		else {
			res.status(404).send('Content not found!');
			return;
		}
		var id = fields.fileorpersonid;
		var description = fields.fileDesc;
		
		console.log(id, description, files);
		
		var dir = `./hosts/${hostname}/public/_data/files/${id}`;
		if (!fs.existsSync(dir))
			fs.mkdirSync(dir);
		dir += "/";
		
		var oldPath = './' + files.path;
		var newPath = dir + files.name;
		fs.rename(oldPath, newPath, function (err) {
			if (err) throw err;
			res.redirect('/home?success#section4');
		});
  });
});



router.get("/img_library_content", (req, res) => {
	var pos = req.query.at;
	if (pos.indexOf("..") > -1){
		res.status(404).send('Content not found!');
		return;
	}
	console.log(pos);
	readDir(publicDir+"/images/library/"+pos, (err, dirContent)=>{
		if (err) throw err;
		res.status(200).send(JSON.stringify(dirContent));
	});
});




var readDir = function(dir, callback){
	if (fs.existsSync(dir)){
		fs.readdir(dir, function (err, files) {
			if (err) callback(err);
			
			var dirContent = {};
			dirContent.files = [];
			dirContent.dirs = [];
			files.forEach(function (file) {
				if (isDir(`${dir}/${file}`))
					dirContent.dirs.push(file);
				else
					dirContent.files.push(file);
			});
			callback(err, dirContent);
		});
	} else {
		callback(undefined, "");
	}
}
function isDir(path){
	return fs.lstatSync(path).isDirectory();
}










module.exports = router;
