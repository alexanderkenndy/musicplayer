/**
 * @file app.js
 * @brief create and initialize music server
 * @author alexander(alexander.kenndy@gmail.com)
 * @date Tue Jun  3 18:56:05 CST 2014
 * LICENSE MIT
 */
 'use strict';
var http = require('http');
var express = require('express');
var path = require('path');
var config = require('./config.js');
var logger = require('./server/util/log.js');
var app = module.exports.app = express();
var server = module.exports.server = http.createServer(app);

var isDebugMode = config.debug;
app.set('view engine',"ejs");
app.set('views',__dirname + '/views/');
app.set('port',process.env.PORT || config.port);

app.use(express.favicon('./favicon.png'));
app.use(express.logger());
app.use(express.methodOverride());
app.use(express.cookieParser('alexander'));
app.use(express.cookieSession());
app.use(express.bodyParser());

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/assets')));
app.use(express.static(path.join(__dirname + '/thirdparty')));

app.get('/',function(req,res){
	res.render('index',{});
});

server.listen(app.get('port'),function(err){
	if(err){
		logger.error('Exception:'+ err);
	}else {
		if (isDebugMode) {
			logger.debug('Music Server running on port ' + app.get('port'));
		} else {
			logger.info('Music Server running on port ' + app.get('port'));
		}
	}
});

process.on('uncaughtException',function(err){
	logger.error('Exception:' + err);
});
