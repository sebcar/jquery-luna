/*
<div class="luna-container">
	<button type="button" class="luna-prev">Prev</button>
	<button type="button" class="luna-play-pause">Play</button>
	<button type="button" class="luna-next">Next</button>
	<span class="luna-time-current"></span>
	<div class="luna-progress-bar">
		<div class="luna-progress-bar-current-position"></div>
	</div>
	<span class="luna-time-total"></span>
	<audio class="luna-audio-tag">
	  <source src="" type="audio/mpeg">
		Your browser does not support the audio element. Please update your browser.
	</audio>
</div>
*/
(function ( $ ) {
 
    $.fn.luna = function(options) {
        var settings = $.extend({
                      
        }, options ),
		htmlOutput = '<div class="luna-container luna">\
			<div class="luna-controls">\
			<button type="button" class="luna-prev"></button>\
			<button type="button" class="luna-play"></button>\
			<button type="button" class="luna-pause"></button>\
			<button type="button" class="luna-next"></button>\
			</div>\
			<span class="luna-time-current"></span>\
			<div class="luna-progress-bar"></div>\
			<span class="luna-time-total"></span>\
			<div class="luna-speaker"></div>\
			<div class="luna-volume"></div>\
			<audio class="luna-audio-tag" id="luna-audio-tag">\
				<source src="" type="audio/mpeg">\
				Your browser does not support the audio element. Please update your browser.\
			</audio>\
		</div>',
		$this = this, player = {}, btnPlayPause = {}, btnNext = {},
		infoCurrent = {}, infoTotal = {}, indexPlaying = 0,
		progressBar = {}, vol = {};		
		$this.append(htmlOutput);
		btnPlay = $('.luna-play');
		btnPause = $('.luna-pause');
		btnNext = $('.luna-next');
		btnPrev = $('.luna-prev');
		infoCurrent = $('.luna-time-current');
		infoTotal = $('.luna-time-total');
		progressBar = $('.luna-progress-bar');
		vol = $('.luna-volume');
		player = document.getElementById('luna-audio-tag');
		player.playPause = function(){			
			if (player.paused === true){
				player.play();
				btnPlay.trigger('focus');	
			}else if (player.paused === false){
				player.pause();
				btnPause.trigger('focus');	
			}
		}			
		
		function nextSong(){
			if (indexPlaying < settings.songs.length - 1){
				indexPlaying++;				
			}else{
				indexPlaying = 0;
			}			
		}
		
		function formatTime(sec) {
			min = Math.floor(sec / 60);
			min = (min >= 10) ? min : "0" + min;
			sec = Math.floor(sec % 60);
			sec = (sec >= 10) ? sec : "0" + sec;
			return min + ":" + sec;
		}		
		  
		function checkProgress(c,t){
			var p = parseInt((c * 100) / t);
			progressBar.slider( "option", "value", p );
		}
		
		function setProgress(t,p){
			player.currentTime = parseInt( (p*t) / 100 );
		}
		
		player.anotherSong = function(songPath){
			infoTotal.text('0:00');
			player.src = songPath;
			btnPlay.trigger('focus');	
			player.play();
		}
		
		btnPlay.on('click', function() {
			player.playPause();				
		} );
		btnPause.on('click', function() {
			player.playPause();		
		} );
		btnNext.on('click', function(){
			nextSong();
			player.anotherSong(settings.songs[indexPlaying]);			
		});
		btnPrev.on('click', function(){
			if (indexPlaying === 0){
				indexPlaying = settings.songs.length - 1;
			}else{
				indexPlaying--;
			}
			player.anotherSong(settings.songs[indexPlaying]);
		} );
		
		player.onended = function(){			
			nextSong();
			player.anotherSong(settings.songs[indexPlaying]);
		}
		
		function timeUpdate(){
			player.ontimeupdate = function () {
				infoCurrent.text( formatTime( player.currentTime ) );	
				checkProgress(player.currentTime, player.duration);
			}			
		}
		function noTimeUpdate(){
			player.ontimeupdate = function () {
			
			}
		}
		timeUpdate();
		
		
		player.onloadedmetadata = function(){
			infoTotal.text( formatTime( player.duration ) );
		}
		
		//loading
		player.src = settings.songs[0];			
		infoCurrent.text( formatTime( player.currentTime ) );	
		progressBar.slider({
			animate: 'fast',
			slide:	function(event, ui){								
				setProgress(player.duration, ui.value);
			}
		});
		progressBar.on('mousedown', function() {
			noTimeUpdate();
		} );
		progressBar.on('mouseup', function(){
			timeUpdate();
		}  );
		player.volume = 0.75;
		vol.slider({
			animate: 'fast',
			slide: function(event, ui) {
				player.volume = ui.value / 100;				
			},
			value: 75
		});
        return this;
    };
 
}( jQuery ));