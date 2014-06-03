var _self = {
	name	: 'Music Server',
	version	: '0.0.1',
	description	: 'Music Player implemented html audio tag with syn lyric',
	port	: 3000,
	log		: {
		level	: 'debug',//default info
		output	: 'console,file', //default console
		path	: '/tmp/music_log' //default /tmp/log/ 
	}
};
module.exports = _self;
