var MusicPlayer = function(index,playlist){
	this.audio = document.getElementById('mp_audio_player');
	this.audio.volume = 1;
	this.playlist = playlist;
	this.lyricContainer = document.getElementById('mp_lyricContainer');  
	this.lyric = null;
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
			$this.lyric = null;	
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
				var lyricUrl = $this.audio.src.substring(0,$this.audio.src.lastIndexOf('.')) + '.lyric';
				$this.getLyric(lyricUrl);
				$('#slider-progress').attr('max',parseInt($this.audio.duration));
			}
			$this.updateStartEndTime();
			if(!stop){
				this.play();
			}
		};

		$this.audio.ontimeupdate = function(){

			if(!$this.lyric){
				return;
			}

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
		//TODO url is the lyric path
		var $this = this;
		var lyricContent = this.playlist[this.currentIndex].lyricContent;
		//this.lyricContainer.textContent = "loading lyric ...";
		
		$this.lyric = $this.parseLyric(lyricContent);
		$this.appendLyric($this.lyric);
		//TODO fail to load lyric	
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
		this.lyricContainer.style.top = 420 + "px";
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
		var lyricContent1 = 
"[ti:猜不透]"
+"\n[ar:丁当]" 
+"\n[al:我爱上的]"
+"\n[by:李泽昊]" 
+"\n"
+"\n[00:02.00]曲目∶猜不透" 
+"\n[00:06.00]歌手∶丁当" 
+"\n[00:10.00]作词∶黄婷" 
+"\n[00:14.00]作曲∶林迈可" 
+"\n[00:18.00]编曲∶林迈可" 
+"\n[00:26.00]"
+"\n[00:27.14]猜不透" 
+"\n[00:30.99]你最近时好时坏的沉默" 
+"\n[00:37.98]我也不想去追问太多" 
+"\n[00:45.35]让试探为彼此的心 上了锁" 
+"\n[00:53.59]" 
+"\n[00:54.65]猜不透" 
+"\n[00:58.72]相处会比分开还寂寞" 
+"\n[01:05.45]两个人都只是得过且过" 
+"\n[01:12.35]无法感受每次触摸 是真的 是热的" 
+"\n[01:24.46]" 
+"\n[01:25.41]如果忽远忽近的洒脱" 
+"\n[01:29.75]是你要的自由" 
+"\n[01:32.50]那我宁愿回到一个人生活" 
+"\n[01:38.50]" 
+"\n[01:39.20]如果忽冷忽热的温柔" 
+"\n[01:43.54]是你的借口" 
+"\n[01:46.17]那我宁愿对你从没认真过" 
+"\n[01:53.49]" 
+"\n[01:55.00]曲目∶猜不透" 
+"\n[01:56.00]歌手∶丁当" 
+"\n[01:57.00]作词∶黄婷" 
+"\n[01:58.00]作曲∶林迈可" 
+"\n[01:59.00]编曲∶林迈可" 
+"\n[02:02.00]" 
+"\n[02:03.11]猜不透" 
+"\n[02:07.09]相处会比分开还寂寞" 
+"\n[02:13.88]两个人都只是得过且过" 
+"\n[02:20.88]无法感受每次触摸 是真的 是热的" 
+"\n[02:33.49]" 
+"\n[02:34.34]如果忽远忽近的洒脱" 
+"\n[02:38.26]是你要的自由" 
+"\n[02:41.24]那我宁愿回到一个人生活" 
+"\n[02:47.10]" 
+"\n[02:47.80]如果忽冷忽热的温柔" 
+"\n[02:51.98]是你的借口" 
+"\n[02:54.57]那我宁愿对你从没认真过" 
+"\n[03:00.74]" 
+"\n[03:01.50]如果忽远忽近的洒脱" 
+"\n[03:05.75]是你要的自由" 
+"\n[03:08.67]那我宁愿回到一个人生活" 
+"\n[03:14.42]" 
+"\n[03:15.30]如果忽冷忽热的温柔" 
+"\n[03:19.52]是你的借口" 
+"\n[03:22.25]那我宁愿对你从没认真过" 
+"\n[03:28.43]" 
+"\n[03:29.16]到底这感觉谁对谁错" 
+"\n[03:33.10]我已不想追究" 
+"\n[03:35.91]越是在乎的人越是猜不透" 
+"\n[03:44.63]" ;

var  lyricContent2 =
"[00:00.34]眼泪的错觉"
+"\n[00:00.44]演唱：群星"
+"\n[00:00.54]"
+"\n[00:00.94]眼泪的错觉 哭泣的依恋"
+"\n[00:05.51]爱在昨天 不停的想念"
+"\n[00:10.34]花蕊的凋谢 情感的善变"
+"\n[00:15.06]誓言飘过 无所谓语言"
+"\n[00:20.32]眼泪的错觉 哭泣的依恋"
+"\n[00:24.79]爱在昨天 不停的想念"
+"\n[00:29.53]花蕊的凋谢 情感的善变"
+"\n[00:34.29]誓言飘过 无所谓语言"
+"\n[00:39.51]为什么要分手 为什么抛弃所有"
+"\n[00:44.53]为什么剩我一人孤独等候"
+"\n[00:48.87]能不能再爱我 能不能陪着我"
+"\n[00:54.26]能不能永远一生不放弃我"
+"\n[00:58.86]为什么要分手 为什么抛弃所有"
+"\n[01:03.74]为什么剩我一人孤独等候"
+"\n[01:08.27]能不能再爱我 能不能陪着我"
+"\n[01:13.56]能不能永远一生不放弃我"
+"\n[01:17.71]时光已经停留 爱人已经远走"
+"\n[01:26.70]花蕊凋谢的接受"
+"\n[01:31.38]让寂寞搁浅 挥挥手"
+"\n[01:39.14]"
+"\n[01:56.55]眼泪的错觉 哭泣的依恋"
+"\n[02:00.82]爱在昨天 不停的想念"
+"\n[02:05.58]花蕊的凋谢 情感的善变"
+"\n[02:10.30]誓言飘过 无所谓语言"
+"\n[02:15.47]为什么要分手 为什么抛弃所有"
+"\n[02:20.42]为什么剩我一人孤独等候"
+"\n[02:24.88]能不能再爱我 能不能陪着我"
+"\n[02:30.21]能不能永远一生不放弃我"
+"\n[02:34.63]为什么要分手 为什么抛弃所有"
+"\n[02:39.67]为什么剩我一人孤独等候"
+"\n[02:44.01]能不能再爱我 能不能陪着我"
+"\n[02:49.42]能不能永远一生不放弃我"
+"\n[02:53.70]时光已经停留 爱人已经远走"
+"\n[03:02.69]花蕊凋谢的接受"
+"\n[03:07.45]让寂寞搁浅 挥挥手"
+"\n[03:13.42]眼泪的错觉 哭泣的依恋"
+"\n[03:17.57]爱在昨天 不停的想念"
+"\n[03:22.39]花蕊的凋谢 情感的善变"
+"\n[03:27.11]誓言飘过 无所谓语言"
+"\n[03:31.83]";
	var songConent1 ={
		songName	: '猜不透',
		artistName	: '丁当',		
		albumName	: '猜不透',
		songUrl		: 'cai_bu_tou.mp3',
		lyricContent: lyricContent1
	};
	var songConent2 ={
		songName	: '眼泪的错觉',
		artistName	: '群星',		
		albumName	: '眼泪的错觉',
		songUrl		: 'yan_lei_de_cuo_jue.mp3',
		lyricContent: lyricContent2
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
