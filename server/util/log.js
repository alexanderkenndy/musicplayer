'use strict';
var output = require('../../config.js').log.output;
var fs = require('fs');
var path = require('../../config.js').log.path;

var Logger = function(){
	this.INFO = 'info';
	this.WARN = 'warn';
	this.DEBUG = 'debug';
	this.ERROR = 'error';
}
Logger.prototype.info  = function(msg){
	this.log(msg,this.INFO);
};
Logger.prototype.warn  = function(msg){
	this.log(msg,this.WARN);
};
Logger.prototype.debug = function(msg){
	this.log(msg,this.DEBUG);
};
Logger.prototype.error = function(msg){
	this.log(msg,this.ERROR);
};
Logger.prototype.log = function(msg,level){
	if (typeof message === 'function' || typeof message === 'object') {
		this.print(msg.toString(),level);	
	} else {
		this.print(msg,level);
	}
};

Logger.prototype.print = function(msg) {
	//TODO fix the log level and add file output
	var outs = output.split(',');
	for(var i=0;i<outs.length;i++){
		switch(outs[i]){
			case 'console':
				console.log(msg);
				break;
			case 'file'	  :
				if(!path){
					path = '/tmp/log';
				}
				break;
			default	:
				console.log(msg);
				break;
		}
	}
}

module.exports = new Logger();

