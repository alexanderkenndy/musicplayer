var http = require('http');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
	res.send('hello');
});
app.listen(3000,function(err){
	console.log('Server running on port 3000');
});
