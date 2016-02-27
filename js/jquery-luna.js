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
    'use strict';
    $.fn.luna = function(options) {
        //defaults
        var settings = {
            onStatusChange : function(){}
        },
        settings = $.extend({

        }, options ),
        //html structure
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
        //declare vars
		$this = this, $player = {}, $btnPlay = {}, $btnPause = {}, $btnNext = {},
        $btnPrev = {},
		$infoCurrent = {}, $infoTotal = {}, indexPlaying = 0,
		$progressBar = {}, $vol = {}, playerStatus = '';

        //append html to container
        $this.append(htmlOutput);

        //assign vars
		$btnPlay = $('.luna-play');
		$btnPause = $('.luna-pause');
		$btnNext = $('.luna-next');
		$btnPrev = $('.luna-prev');
		$infoCurrent = $('.luna-time-current');
		$infoTotal = $('.luna-time-total');
		$progressBar = $('.luna-progress-bar');
		$vol = $('.luna-volume');
		$player = document.getElementById('luna-audio-tag');

        //PLAYER'S FUNCTIONS -----------

        //play-pause
		$player.playPause = function(e){
			if ($player.paused === true){
				$player.play();
				$btnPlay.trigger('focus');
                setEventStatusChange('playing');
			}else if ($player.paused === false){
				$player.pause();
				$btnPause.trigger('focus');
                setEventStatusChange('paused');
			}
		};

        //play another song
        $player.anotherSong = function(songPath){
			$infoTotal.text('0:00');
			$player.src = songPath;
			$btnPlay.trigger('focus');
			$player.play();
            setEventStatusChange('changing_song');
		}

        //PLUGIN'S FUNCTIONS

        //next song
		function nextSong(){
			if (indexPlaying < settings.songs.length - 1){
				indexPlaying++;
			}else{
				indexPlaying = 0;
			}
		}

        //formating time for bar
		function formatTime(sec) {
			var min = Math.floor(sec / 60);
			min = (min >= 10) ? min : "0" + min;
			var sec = Math.floor(sec % 60);
			sec = (sec >= 10) ? sec : "0" + sec;
			return min + ":" + sec;
		}

        //check progress
		function checkProgress(c,t){
			var p = parseInt((c * 100) / t);
			$progressBar.slider( "option", "value", p );
		}

        //set progress
		function setProgress(t,p){
			$player.currentTime = parseInt( (p*t) / 100 );
		}

        //set status for the onStatusChange's event
        function setEventStatusChange(s){
            playerStatus = s;
            settings.onStatusChange(playerStatus);
        }

        //PLAYER'S EVENTS
		$player.onended = function(){
			nextSong();
			$player.anotherSong(settings.songs[indexPlaying]);
            setEventStatusChange('song_finished');
		}

        //BUTTON'S EVENTS
        $btnPlay.on('click', function() {
            $player.playPause();
        } );

        $btnPause.on('click', function() {
            $player.playPause();
        } );

        $btnNext.on('click', function(){
            nextSong();
            $player.anotherSong(settings.songs[indexPlaying]);
        });

        $btnPrev.on('click', function(){
            if (indexPlaying === 0){
                indexPlaying = settings.songs.length - 1;
            }else{
                indexPlaying--;
            }
            $player.anotherSong(settings.songs[indexPlaying]);
        } );


        $player.oncanplay = function(){

            // UI EVENTS
            timeUpdate();

            $progressBar.slider({
    			animate: 'fast',
    			slide:	function(event, ui){
    				setProgress($player.duration, ui.value);
                    setEventStatusChange('changing_progress');
    			}
    		});
    		$progressBar.on('mousedown', function() {
    			noTimeUpdate();
    		} );
    		$progressBar.on('mouseup', function(){
    			timeUpdate();
    		}  );
    		$vol.slider({
    			animate: 'fast',
    			slide: function(event, ui) {
    				$player.volume = ui.value / 100;
                    setEventStatusChange('volumen_changed_to_' + $player.volume);
    			},
    			value: 75
    		});
            $player.volume = 0.75;

            setEventStatusChange('ready_to_play');
        }

        $player.onerror = function(e){
            setEventStatusChange('error_loading');
        }

		$player.onloadedmetadata = function(){
            $infoCurrent.text( formatTime( $player.currentTime ) );
            $infoTotal.text( formatTime ( $player.duration ) );
            setEventStatusChange('metadata_loaded');
		}

        function timeUpdate(){
			$player.ontimeupdate = function () {
				$infoCurrent.text( formatTime( $player.currentTime ) );
				checkProgress($player.currentTime, $player.duration);
			}
		}
		function noTimeUpdate(){
			$player.ontimeupdate = function () {

			}
		}

        //PUBLIC METHODS

        //get status
        $this.getStatus = function(){
            return playerStatus;
        }



        //loading
		$player.src = settings.songs[0];

        return this;
    };

}( jQuery ));
