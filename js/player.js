var player = 
{
	playerObject: $("<audio/>", {id :'musicPlayer'}),
	currentTrack:0,
	trackCount:0,
	repeatPlayList: false,
	playlistSources: "",
	UITrackLengthId:"trackLenght",
	UITimeBarId:"divBarra",
	UIElapsedTimeId:"elapsedTime",
	UITrackNameId: "CurrentTrackName",
	initialize: function (){
		
		this.playerObject = $("<audio/>", {id :'musicPlayer'});
		this.playlistSources = new Array();
		$(this.playerObject).on('ended',function(){
			if(player.currentTrack==player.trackCount-1){
				//get ready for next play
				player.currentTrack = 0;
				$(this)[0].src = player.playlistSources[player.currentTrack];
				$(this)[0].load();
				if(player.repeatPlayList){
					player.Play(); 
				}
			}else{
				player.currentTrack++;
				$(this)[0].src = player.playlistSources[player.currentTrack];
				$(this)[0].load();
				player.Play(); 
			}
		});
		this.currentTrack=0;
		
		$(this.playerObject).on('timeupdate',function(){
			function ToSeconds(elapsedTime){
				//obtener los minutos
				var minutes=Math.floor(elapsedTime/60);
				//se obtienen los segundos
				var seconds=Math.floor(elapsedTime-minutes*60);
				
				//le agregamos un cero a los minutos y segundos, solo por estetica
				if(seconds<10) seconds='0'+seconds;
				if(minutes<10) minutes='0'+minutes;
				
				//devolvemos un array con el tiempo formateado
				return Array(minutes,seconds);
			};
			//current time
			var elapsedTime=$(this)[0].currentTime;
			//duracion total de la cancion
			var totalTime=$(this)[0].duration;
			//porcentaje aproximado de la reproduccion
			var progressPerc=(elapsedTime*100)/totalTime;
			//formateamos el tiempo
			var timeObj=ToSeconds(elapsedTime);
			
			//obtenemos la duracion de la cancion
			var durationObj=ToSeconds(totalTime);
			$('#'+player.UITrackLengthId).find('span').text(durationObj[0]+':'+durationObj[1]);
			
			//el ancho de la barra sera el porcentaje que obtuvimos... recuerde que la capa #divBarra
			//tiene un ancho predeterminado de 100% (se ajusta al contenedor padre), es por eso que
			//le estoy dando el tamano con porcentajes... veamoslo como una especie de truco
			$('#'+player.UITimeBarId).css('width',progressPerc+'%');
			//actualizar el tiempo transcurrido
			$('#'+player.UIElapsedTimeId).find('span').text(timeObj[0]+':'+timeObj[1]);
		});
		
		$(this.playerObject).on('error',function(){
				
			alert("Cannot reproduce the media");
				
		});
		if (!(!!(this.playerObject.canPlayType) && ("no" != this.playerObject.canPlayType("audio/mpeg")) && ("" != this.playerObject.canPlayType("audio/mpeg")))) {
			//Add flash fallback here
		}
	},

	addToPlaylist: function (song)
	{
		if ($(this.playerObject).length > 0)
		{
			var source= $('<source/>');
			if (this.playerObject[0].canPlayType('audio/mpeg;')) {
				$(source).attr("src", song);
				this.playlistSources[this.trackCount] = song;
				$(source).attr("type", "audio/mpeg");
			} 
			$(this.playerObject).append(source);
			this.trackCount++;
		}
	},
	
	Play: function(){
		this.playerObject[0].play();
		if (player.playlistSources[player.currentTrack].length > 18)
		{$("#"+player.UITrackNameId).text(player.playlistSources[player.currentTrack].substring(0,18)+"...");
		}
		else
			$("#"+player.UITrackNameId).text(player.playlistSources[player.currentTrack]);
	},
	
	Next: function(){
		if(this.currentTrack==this.trackCount-1){
				if(this.repeatPlayList){
					this.currentTrack = 0;
					this.playerObject[0].src = this.playlistSources[this.currentTrack];
					this.playerObject[0].load();
					this.Play();
				}
			}else{
				this.currentTrack++;
				this.playerObject[0].src = this.playlistSources[this.currentTrack];
				this.playerObject[0].load();
				this.Play();
			}
	},
	Prev: function(){
		if(this.currentTrack==0){
				if(this.repeatPlayList){
					this.currentTrack = this.trackCount-1;
					this.playerObject[0].src = this.playlistSources[this.currentTrack];
					this.playerObject[0].load();
					this.Play();
				}
			}else{
				this.currentTrack--;
				this.playerObject[0].src = this.playlistSources[this.currentTrack];
				this.playerObject[0].load();
				this.Play();
			}
	}, 
	Mute: function(){
		this.playerObject[0].muted = !this.playerObject[0].muted;
	},
	VolumeUp: function (){
		if(this.playerObject[0].volume!=1) this.playerObject[0].volume+=0.1;
	},
	VolumeDown:function(){
		if(this.playerObject[0].volume!=0) this.playerObject[0].volume-=0.1;
	},
	Pause: function(){
		this.playerObject[0].pause();
	}
	
	
	
}	
