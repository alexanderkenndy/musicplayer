var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.set('view engine',"ejs");
app.set('views',__dirname + '/views/');
app.use(express.logger());
app.use(express.methodOverride());
app.use(express.cookieParser('alexander'));
app.use(express.cookieSession());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/thirdparty'));
app.get('/',function(req,res){
	res.render('index',{});
});
app.listen(3000,function(err){
	console.log('Server running on port 3000');
});
