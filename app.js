var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(function(req,res){
	res.write('hello music server');
	res.end();
});
server.listen(3000,function(err){
	console.log('Server running on port 3000');
});
