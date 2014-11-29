var restaurants = [{name:"Wendy's", lat:"", lng:"", vicinity:""}, {name:"McDonalds", lat:"", lng:"", vicinity:""},
					{name:"Chick-fil-a", lat:"", lng:"", vicinity:""}, {name:"Five Guys", lat:"", lng:"", vicinity:""},
	                {name:"Gold Star", lat:"", lng:"", vicinity:""}, {name:"La Mexicana", lat:"", lng:"", vicinity:""}, 
	                {name:"Chipotle", lat:"", lng:"", vicinity:""}, {name:"Tazza Mia", lat:"", lng:"", vicinity:""},
	                {name:"Panera", lat:"", lng:"", vicinity:""}, {name:"Just Crepes", lat:"", lng:"", vicinity:""}, 
	                {name:"Arby's", lat:"", lng:"", vicinity:""}, {name:"Indian", lat:"", lng:"", vicinity:""}];

$(document).ready(function() {
    var isDragging = false;
	var previousDragX, previousDragY, currentDragX, currentDragY, clickedX, clickedY;
	var arcAngle = 0;
	var changedAngle = 0;

	drawRouletteWheel();

	if(params.length > 0){
		initLocation();
		proceed();
	}

	$('a.settings').click(function() {
		toggleSettings();
	});
	$('button#search, button#settings-search').click(function() {
		searchUserDefined();
	});
	$('button#location-option-current').click(function() {
		$('.select-localisation').hide();
		$('.search-localisation').show();
		initLocation();
	});
	$('button#location-option-find').click(function() {		
		$('.select-localisation').hide();
		$('.panel-map').show();
		initialize();
	});
	$('button#localistion-failure').click(function() {
		proceed();
	});
	$('button#select-location').click(function() {
		$('button#select-location').html('<i class="fa fa-refresh fa-spin"></i>');
		params.lat = $('#latBox').val();
		params.long = $('#lngBox').val();
		initLocation();
	});
	$('button#spin').click(function() {
		if(!retIsSpinning()) {
			spin(false); // true indicates to spin clockwise
		}
	});
	$('#wheel').mousedown(function(e) {
		clickedX = e.pageX;
		clickedY = e.pageY;
		//set up the first instance of previous drag
		previousDragX = e.pageX;
		previousDragY = e.pageY;
		isDragging = true;
	})
	$('#wheel').mousemove(function(e) {
		if(isDragging && !retIsSpinning()) {
			currentDragX = e.pageX;
			currentDragY = e.pageY;

			//finding the movement from the last drag
			changedAngle = Math.atan2(currentDragY - $('button#spin').position().top, currentDragX - $('button#spin').position().left);
			changedAngle -= Math.atan2(previousDragY - $('button#spin').position().top, previousDragX - $('button#spin').position().left);

			//recalculating the arc from when the mouse was firsted click -- used to indicate a 'spin'
			arcAngle = Math.atan2(currentDragY - $('button#spin').position().top, currentDragX - $('button#spin').position().left);
			arcAngle -= Math.atan2(clickedY - $('button#spin').position().top, clickedX - $('button#spin').position().left);

			//console.log(changedAngle); // amount of radians the move is dragged

			//add whatever the angle has changed by from the last movement of the mouse
			addToStartAngle(changedAngle);
			drawRouletteWheel();

			//update the previous with the current coordinate of the mouse
			previousDragY = currentDragY;
			previousDragX = currentDragX;
		} 
	});
	$('#wheel').mouseup(function(e) {
		if((arcAngle >= 1.25 || arcAngle <= 1.25) && !retIsSpinning() && changedAngle > 0) { // a minimum delta of rad = 1.25 required to drag around the wheel to count as a 'spin' 
			spin(true);
		} else if((arcAngle >= 1.25 || arcAngle <= 1.25) && !retIsSpinning() && changedAngle < 0) {
			spin(false); 
		}
		isDragging = false;
	});
	$('#wheel').mouseout(function(e) {
		isDragging = false;
	});
	$('canvas#confetti-world').click(function() {
		proceed();
	});
	$('input#shareLink').click(function() {
		$(this).select();
	});
	$('button#new-location').click(function() {
		reset();
		params.lat = undefined;
		params.long = undefined;
		blurBackground();
		$('.select-localisation').show();
	});
});

function proceed() {
	$('.select-localisation').hide();
	$('.localisation').hide();
	$('.panel-map').hide();
	$('.result').hide();
	
	//Clear google maps
	$('#search').val('');
	$('#select-location').text('Select Location');
	
	//Clear confetti canvas
	var confetti = document.getElementById('confetti-world');
	confetti.width = confetti.width;
	$('#confetti-world').hide();
	
    unblurBackground();
    generateShareLink();
}

function blurBackground() {
	$('.unblur').removeClass('unblur').addClass('blur');
}

function unblurBackground() {
	$('.blur').removeClass('blur').addClass('unblur');
}

function toggleSettings() {
	$('.settings').toggleClass('settings-open');
	$('.clickme').hide();
}

function closeSettings() {
	if($('.settings-open')[0] !== undefined) {
		$('.settings').removeClass('settings-open');
	}
}

function generateShareLink() {
	$('#shareLink').val(createURL());
}

function createURL() {
	var url = window.location.href.slice(0, window.location.href.indexOf('?')) + "?";
	var params = { 'lat': $('#latitude').val(), 
					'long':  $('#longitude').val(), 
					'radius': $('#radius').val(),
					'type' : $('.settings input[type=radio]:checked').val(), 
					'maxplaces': $('#maxPlaces').val() };
	
	for(var key in params) {
		if (params[key].length > 0) {
			if(url.substr(url.length - 1) == "?") {
				url += key + "=" + params[key];
			} else {
				url += "&" + key + "=" + params[key];
			}
		}
	}
	return url;	
}
