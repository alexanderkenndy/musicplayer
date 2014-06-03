'use strict';
var fs = require('fs');
var config = require('../../config.js');
var output = config.log.output;
var path = config.log.path;
var outputlevel = config.log.level;

var Logger = function(){
	this.ALL	= 'all';
	this.TRACE	= 'trace';
	this.DEBUG	= 'debug';
	this.INFO	= 'info';
	this.WARN	= 'warn';
	this.ERROR	= 'error';
	this.FATAL	= 'fatal';
}

var LoggerMap = {
	'all'	:0,
	'trace'	:1,
	'debug'	:2,
	'info'	:3,
	'warn'	:4,
	'error'	:5,
	'fatal'	:6
};

Logger.prototype.all = function(msg){
	this.log(msg,this.ALL);
};

Logger.prototype.trace= function(msg){
	this.log(msg,this.TRACE);
};

Logger.prototype.debug = function(msg){
	this.log(msg,this.DEBUG);
};

Logger.prototype.info  = function(msg){
	this.log(msg,this.INFO);
};
Logger.prototype.warn  = function(msg){
	this.log(msg,this.WARN);
};
Logger.prototype.error = function(msg){
	this.log(msg,this.ERROR);
};

Logger.prototype.fatal= function(msg){
	this.log(msg,this.FATAL);
};

Logger.prototype.log = function(msg,level){
	level = !level ? 'info' : level;
	if (typeof message === 'function' || typeof message === 'object') {
		this.print(msg.toString(),level);	
	} else {
		this.print(msg,level);
	}
};

Logger.prototype.print = function(msg,level) {
	if(LoggerMap[outputlevel] && LoggerMap[outputlevel]>  LoggerMap[level]) return ;
	//TODO fix the log level and add file output
	//TODO add option of date format
	msg = "["+ level.toUpperCase()+"] " + new Date() + " "  + msg + '\n';
	var outs = output.split(',');
	for(var i=0;i<outs.length;i++){
		switch(outs[i]){
			case 'console':
				if (level ==='debug' || level ==='fatal' || level === 'all') {
					console.log(msg);
				} else {
					console[level].apply(console,[msg]);
				}

				break;
			case 'file'	  :
				if(!path){
					path = '/tmp/log/music.log';
				}
				fs.appendFileSync(path,msg);
				break;
			default	:
				console.log(msg);
				break;
		}
	}
}

module.exports = new Logger();

