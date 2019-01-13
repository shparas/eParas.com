var mainFunctions = {
	setDisplayToNone : function(elem){ 
		elem.style.display = "none";
	},
	stopEvent : function(e){
		e.stopPropagation();
	},
	// for cross and cancel elements	
	activateCross : function(){
		var crossElements = document.getElementsByClassName("cross");
		for (var i = 0; i <  crossElements.length; i++){
			crossElements[i].addEventListener("click", function(e){ mainFunctions.setDisplayToNone(this.parentElement.parentElement.parentElement);});
			crossElements[i].parentElement.addEventListener("click", function(e){ mainFunctions.stopEvent(e);});
		}
	},
	activateCancelBg : function(){
		var cancelElements = document.getElementsByClassName("full-dark-bg");
		for (var i = 0; i <  cancelElements.length; i++)
			cancelElements[i].addEventListener("click", function(e){ mainFunctions.setDisplayToNone(this);});
	}
}
mainFunctions.activateCross();
mainFunctions.activateCancelBg();


var navBarDisabler = function(){
	var path = location.pathname.substring(1).split("/",1)[0];
	if (path != ""){
		var elems = document.querySelectorAll("a[href^='/" + path + "']");
		if (elems)
			for (var i = 0, l = elems.length; i < l; i++) {
				var el = elems[i];
				el.className += " disabled";
		}
	}
};
function footerLoaderChristmas(){
	var text = ["© Paras Humagain 2018", "All rights reserved"];
	var box = document.getElementsByClassName("body-footer-main-text")[0];
	box.innerHTML=""; //&copy;";
	for (var i1 = 0; i1 < text.length; i1++){
		for (var i2 = 0; i2 < text[i1].length; i2++){
			var color1 = Math.floor(Math.random() * 255);
			var color2 = Math.floor(Math.random() * 255);
			var color3 = Math.floor(Math.random() * 100);
			box.innerHTML += "<span style=\"color:rgb(" + color1 +',' + color2 + "," + color3 + ");\">" + text[i1][i2] + "</span>";
		}
		if (i1 != text.length-1) box.innerHTML += "<br>";
	}
}
function footerLoader(){
	var changer = function(){
		var i1 = Math.floor(Math.random() * text.length);
		var i2 = Math.floor(Math.random() * text[i1].length);
		var ele = document.getElementsByClassName("b-f-t-i-"+i1+"-"+i2)[0];
		if (ele){
			ele.style.opacity = "0";
			setTimeout(function(){ele.style.opacity = "1"; setTimeout(changer, 1000);}, 100);
		}
	}
	var text = ["© Paras Humagain 2018", "All rights reserved"];
	var box = document.getElementsByClassName("body-footer-main-text")[0];
	box.innerHTML="";
	
	for (var i1 = 0; i1 < text.length; i1++){
		for (var i2 = 0; i2 < text[i1].length; i2++)
			box.innerHTML += "<span class='b-f-t-i-" + i1 + "-" + i2 + "'>" + text[i1][i2] + "</span>";
		if (i1 != text.length-1) box.innerHTML += "<br>";
	}
	changer();
}




var bodyOnLoad = function(){
	navBarDisabler();
	footerLoader();
};