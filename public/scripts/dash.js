var dash = {
	bg : bgLinks,
	quotes: quotes,
	refreshRate: 60,	// in seconds
	setBg: function(){
		setTimeout(()=>{
			var rand = Math.floor(Math.random() * Math.floor(this.bg.length));
			var container = document.getElementsByClassName("dash-background-1")[0];
			container.style.backgroundImage = "url(" + this.bg[rand].url + ")";
			setTimeout(()=>{
				this.fadeOut("dash-background-2");
				setTimeout(()=>{
					document.getElementsByClassName("dash-background-2")[0].style.backgroundImage = document.getElementsByClassName("dash-background-1")[0].style.backgroundImage;
					document.getElementsByClassName("dash-background-2")[0].style.opacity = 1.0;
				},10000);
			}, 10000);
		},10000);
	},
	setTime: function(){
		var time = new Date();
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		
		var fullHours = time.getHours();
		var hours = fullHours % 13;
		if (fullHours > 12) hours++;
		var shift = (fullHours<12?"AM":"PM");
		var minutes = time.getMinutes();
		var time_str = (hours<10?(hours==0?"12":"0"+hours):hours) + ":" + (minutes<10?"0"+minutes:minutes);
		var date_str = (time.getMonth() + 1) + "-" + time.getDate() + " " + days[time.getDay()];
		
		document.getElementById('time-value').innerHTML = time_str;
		document.getElementById('date-value').innerHTML = date_str;
		
		if (fullHours < 6 || fullHours > 19)
			document.getElementsByClassName('bg-brightness')[0].style.backgroundColor = "rgba(0,0,0,0.6)"
		else
			document.getElementsByClassName('bg-brightness')[0].style.backgroundColor = "rgba(0,0,0,0)"
	},
	setTemperature: function() {
		var request_call = new XMLHttpRequest();
		request_call.open('GET', 'https://api.openweathermap.org/data/2.5/weather?zip=76013,us&appid=cbd6bdf03fdf52bff922fa8dd4835393', true);
		request_call.onload = function () {
				var tempObj = JSON.parse(this.responseText);
				var avgTemp = (tempObj.main.temp_max + tempObj.main.temp_min) / 2;
				var temp = Math.floor(32 + 1.8 * (avgTemp - 273));
				document.getElementById('temp-value').innerHTML = temp + "°";
				document.getElementById('temp-image').src = "https://openweathermap.org/img/w/"+tempObj.weather[0].icon + ".png";
			}
		request_call.send();
	},
	setQuote: function(){
		var rand = Math.floor(Math.random() * Math.floor(this.quotes.length));
		document.getElementsByClassName("quote-quote")[0].innerHTML = this.quotes[rand].quote;
		document.getElementsByClassName("quote-by")[0].innerHTML = this.quotes[rand].by;
	},
	fadeOut: function(className){
		var style = document.getElementsByClassName(className)[0].style;
		if (style.opacity <= 0.0)
			style.opacity = 0.0;
		else{
			style.opacity -= 0.1;
			setTimeout(()=>{this.fadeOut(className);}, 50);
		}
	},
	fadeIn: function(className){
		var style = document.getElementsByClassName(className)[0].style;
		if (style.opacity >= 1.0)
			style.opacity = 1.0;
		else{
			style.opacity += 0.1;
			setTimeout(()=>{this.fadeIn(className);}, 50);
		}
	},
	runner: function(){
		this.setBg();
		this.setTime();
		this.setQuote();
		this.setTemperature();
	},
	start: function(){
		this.runner();
		this.loadNotes();
		setInterval(()=>{this.runner()}, this.refreshRate*1000);
	},
	loadNotes: function(){
		for (var i = 0; i < notes.length; i++)
			document.getElementsByClassName("notes-body")[0].innerHTML += '<li class="list-group-item py-1">' + notes[i] + '</li>';
	},
}

var container = document.getElementsByClassName("dash-background-2")[0];
container.style.backgroundImage = "url(" + dash.bg[0].url + ")";
container.style.opacity = 1.0;

container = document.getElementsByClassName("dash-background-1")[0];
container.style.backgroundImage = "url(" + dash.bg[0].url + ")";
container.style.opacity = 1.0;
	
dash.start();
