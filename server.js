var express = require('express');
var engine = require('ejs-locals');
var fs = require('fs-extra');
var fstat=require('fs');
var busboy = require('connect-busboy');
var router = express.Router();
var bodyParser = require('body-parser');
var path=require("path");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(busboy());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));

var port=process.env.PORT || 8080;


app.post('/upload',function(req, res) {
	req.pipe(req.busboy);	
	var fstream;
	req.busboy.on('error',function(err){
		console.log(err);
	});
	req.busboy.on('file', function (fieldname, file, filename) {
		console.log("Uploading: " + filename);
		fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
		file.pipe(fstream);
		fstream.on('close', function () {
			console.log("Upload Finished of " + filename);
			var filePath=__dirname+'/uploads/'+filename;
			 var stats = fs.statSync(filePath);
			 var obj={"size":stats["size"]}; //where to go next
			 fs.unlinkSync(filePath,function(err){
			 	if(err)
			 	{
			 		console.log(err);
			 	}
			 	console.log("file deleted successfully");
			 });
			 res.send(obj);
		});
	});
	req.busboy.on('finish',function(){
		console.log("&");
	});
});
app.get('/',function(req,res,next){
	res.render('index.html');
});
app.listen(port,function(){
	console.log("Runninng");
});