var MusicPlayer = function(index,playlist){
	this.audio = document.getElementById('mp_audio_player');
	this.audio.volume = 1;
	this.playlist = playlist;
	this.lyricContainer = document.getElementById('mp_lyricContainer');  
	this.lyricContainer.style.top = 420 + "px";
	this.lyric = [];
	this.paused = false;
	this.currentIndex = index;
    this.lyricStyle = 0; //random num to specify the different class name for lyric
};

MusicPlayer.prototype = {
	constructor	: MusicPlayer,
	init		: function(){
		this.setMetadata();
		this.audio.onended = function(){
		};
		this.audio.onerror = function(){
		};
	},
	setPosition : function(currentTime){
		this.audio.currentTime = currentTime;
	},
	setVolume	: function(volume){
		if (volume >= 0 && volume <= 100) {
			this.audio.volume = volume / 100;
		}
	},
	setMetadata : function(){
		this.paused = false;
		var songConent = this.playlist[this.currentIndex];	

		var songName = songConent.songName;
		$('#mp_songname').html(songName);

		var artistName = songConent.artistName;
		$('#mp_artistname').html(artistName);

		var albumName = songConent.albumName;
		$('#mp_albumname').html(albumName);
	},
	stop		: function(){
		this.setMetadata();
		this.play(true);
	},
	pause		: function(){
		this.audio.pause();
		this.paused = this.audio.paused;
	},
	updateStartEndTime : function(){
		var $this = this;
		var startTime = document.getElementById('audio_started_time');
			startTime.innerHTML = "<span>" + $this.formatDuration(parseInt($this.audio.currentTime)) +"</span>";
		var endTime = document.getElementById('audio_ended_time');
				endTime.innerHTML = "<span>-" + $this.formatDuration(parseInt($this.audio.duration- $this.audio.currentTime))  +"</span>";

		$('#slider-progress').attr('value',parseInt($this.audio.currentTime));
		$('#slider-progress').slider( "refresh" );

	},
	play		: function(stop){
		var $this = this;
		if(!$this.paused){
			$this.lyric = [];	
			$this.audio.src = $this.playlist[$this.currentIndex].songUrl;
			//$this.lyricContainer.textContent = 'loading lyric...';
			$this.lyricStyle = Math.floor(Math.random() * 5);
		} else {
			if(!stop){
				$this.audio.play();
			}
		}

		$this.audio.oncanplay = function(){
			if (!$this.paused) {
				var lyricUrl = $this.audio.src.substring(0,$this.audio.src.lastIndexOf('.')) + '.lrc';
				$this.getLyric(lyricUrl);
				$('#slider-progress').attr('max',parseInt($this.audio.duration));
			}
			$this.updateStartEndTime();
			if(!stop){
				this.play();
			}
		};

		$this.audio.ontimeupdate = function(){

			$this.updateStartEndTime();

			for (var i = 0, l = $this.lyric.length; i < l; i++) {
                if (this.currentTime > $this.lyric[i][0] - 0.50 /*preload the lyric by 0.50s*/ ) {
                    //single line display mode
                    // $this.lyricContainer.textContent = $this.lyric[i][1];
                    //scroll mode
                    var line = document.getElementById('line-' + i),
                        prevLine = document.getElementById('line-' + (i > 0 ? i - 1 : i));
                    prevLine.className = '';
                    line.className = 'current-line-' + $this.lyricStyle;
                    $this.lyricContainer.style.top = 420 - line.offsetTop + 'px';
					$this.lyricContainer.style.display = 'block';

					var beforeShowLength = i < 8 ? i : 8;
					var beforeOpacity =8;
					for(var j=i;j >= i - beforeShowLength;j--){
						var opacityLine = document.getElementById('line-' + j);	
						if(opacityLine){
							opacityLine.style.opacity = beforeOpacity/ 10; 
							beforeOpacity--;
						}
					}

					var total = $this.lyric.length;
					var afterShowLength = total - i > 10 ? 10 : total -i;	
					var afterOpacity = 10;
					for (var k =i; k<= i + afterShowLength; k++) {
						var opacityLine = document.getElementById('line-' + k);	
						if(opacityLine){
							opacityLine.style.opacity = afterOpacity/ 10; 
							afterOpacity--;
						}
					}

                };
            }
		};
	
	},
	playNext	: function(){
		if (this.currentIndex < this.playlist.length -1) {
			this.currentIndex +=1;
		}
		this.setMetadata();
		this.play();
	},
	playPre		: function(){
		var preIndex = this.currentIndex;
		if (this.currentIndex > 0) {
			this.currentIndex -=1;
		}
		this.setMetadata();
		this.play();
	},
	getLyric	: function(url){
		var $this = this;
		this.lyricContainer.textContent = "loading lyric ...";
		var request = new XMLHttpRequest();
		request.open('get',url,true);
		request.responseType = 'text';
		request.timeout = 5000;
		request.onload = function(){
			$this.lyric = $this.parseLyric(request.response);
			$this.appendLyric($this.lyric);
		}

		request.onerror = request.onabort = request.ontimeout = function(){
			$this.lyricContainer.textContent = "Failed to load lyric"
		}
		request.send();
	},
	parseLyric	: function(text){
		//get each line from the text
        var lines = text.split('\n'),
            //this regex mathes the time [00.12.78]
            pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
            result = [];
        //exclude the description parts or empty parts of the lyric
        while (!pattern.test(lines[0])) {
            lines = lines.slice(1);
        };
        //remove the last empty item
        lines[lines.length - 1].length === 0 && lines.pop();
        //display all content on the page
        lines.forEach(function(v, i, a) {
            var time = v.match(pattern),
                value = v.replace(pattern, '');
            time.forEach(function(v1, i1, a1) {
                //convert the [min:sec] to secs format then store into result
                var t = v1.slice(1, -1).split(':');
                result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
            });
        });
        //sort the result by time
        result.sort(function(a, b) {
            return a[0] - b[0];
        });
		this.lyricloaded = true;
        return result;
	},
	appendLyric : function(lyric){
        var fragment = document.createDocumentFragment();
        //clear the lyric container first
        this.lyricContainer.innerHTML = '';
        lyric.forEach(function(v, i, a) {
            var line = document.createElement('p');
            line.id = 'line-' + i;
            line.textContent = v[1];
            fragment.appendChild(line);
        });
        this.lyricContainer.appendChild(fragment);
		this.lyricContainer.style.display = 'none';
	},
	formatDuration : function(time){
		var pre = parseInt(time / 60);
		var left = time - pre * 60;
		pre = pre < 10 ? ("0" + pre ) : pre;
		left = left < 10 ? ("0" + left) : left;
		return pre + ":" + left;
	}

};
$(document).ready(function(){
	var winHeight = window.screen.height;
	//$('#mp_ui_content').css('height',winHeight -132);
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
