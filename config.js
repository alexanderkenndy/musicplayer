var _self = {
	name	: 'Music Server',
	version	: '0.0.1',
	description	: 'Music Player implemented html audio tag with syn lyric',
	port	: 3000,
	debug	: false,
	log		: {
		level	: 'fatal',//default info [info,warn,debug,error]
		output	: 'console,file', //default console  [console,file]
		path	: '/tmp/music_log/music.log' //default /tmp/log/ 
	}
};
module.exports = _self;
