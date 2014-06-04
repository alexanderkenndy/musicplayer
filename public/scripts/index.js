$(document).ready(function(){
	//TODO make a fake playlist
	var songConent1 ={
		songName	: '猜不透',
		artistName	: '丁当',		
		albumName	: '猜不透',
		songUrl		: 'cai_bu_tou.mp3'
	};
	var songConent2 ={
		songName	: '眼泪的错觉',
		artistName	: '群星',		
		albumName	: '眼泪的错觉',
		songUrl		: 'yan_lei_de_cuo_jue.mp3'
	};

	var playlist =[];
	playlist.push(songConent1);
	playlist.push(songConent2);
	var player = new MusicPlayer(0,playlist);
	player.init();

	var played = false;
	var fullscreen = true;

	$("#audio_play_controller > div").add($("#audio_play_screen_controller")).each(function(){
		$(this).mouseover(function(){
			$(this).attr('class',$(this).attr('class').replace('nor','focus'));
		});

		$(this).mouseout(function(){
			$(this).attr('class',$(this).attr('class').replace('focus','nor'));
		});

		$(this).click(function(){
			var idAttr = $(this).attr('id');
			switch(idAttr) {
				case	'audio_stop':
					player.stop();
					$('#audio_play').attr('class',$('#audio_play').attr('class').replace('pause','play'));
					break;
				case	'audio_pre':
					player.playPre();
					break;
				case	'audio_play':
					if (played) {
						player.pause();
					} else {
						player.play();
					}
					
					var first = played ? 'pause' : 'play';
					var second = played ? 'play' : 'pause';
					$(this).attr('class',$(this).attr('class').replace(first,second));
					played = !played;
					break;
				case	'audio_next':
					player.playNext();
					break;
				case	'audio_play_screen_controller':
					var first = fullscreen ? 'smallscreen' : 'allscreen';
					var second = fullscreen ? 'allscreen'  : 'smallscreen';
					$(this).attr('class',$(this).attr('class').replace(first,second));
					fullscreen = !fullscreen;

					break;
				default	:
					break;
			}
		});
	});		

	$('#slider-volume').slider({
		stop : function(event,ui){
			var volume = event.target.value;
			player.setVolume(parseInt(volume));
		}
	});
	$('#slider-progress').slider({
		stop : function(event,ui){
			var currentTime = event.target.value;
			player.setPosition(currentTime);
		}
	});

});
