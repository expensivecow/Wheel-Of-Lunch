var restaurants = [{name:"Wendy's", lat:"", lng:"", vicinity:""}, {name:"McDonalds", lat:"", lng:"", vicinity:""},
					{name:"Chick-fil-a", lat:"", lng:"", vicinity:""}, {name:"Five Guys", lat:"", lng:"", vicinity:""},
	                {name:"Gold Star", lat:"", lng:"", vicinity:""}, {name:"La Mexicana", lat:"", lng:"", vicinity:""}, 
	                {name:"Chipotle", lat:"", lng:"", vicinity:""}, {name:"Tazza Mia", lat:"", lng:"", vicinity:""},
	                {name:"Panera", lat:"", lng:"", vicinity:""}, {name:"Just Crepes", lat:"", lng:"", vicinity:""}, 
	                {name:"Arby's", lat:"", lng:"", vicinity:""}, {name:"Indian", lat:"", lng:"", vicinity:""}];

$(document).ready(function() {
    var isDragging = false;
    var originX = $('button#spin').offset().left;
    var originY = $('button#spin').offset().top;
	var clickedX, clickedY, releasedX, releasedY, draggingX, draggingY;
	var angleRad;
	var lastAngle;
	var target_wp;
	var angleDegree;
	var s_rad = 0;

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
		spin();
	});
	$('#wheel').mousedown(function(e) {
		clickedX = e.pageX;
		clickedY = e.pageY;
		isDragging = true;
	})
	$('#wheel').mousemove(function(e) {
		if(isDragging) {
			draggingX = e.pageX;
			draggingY = e.pageY;

			s_rad = Math.atan2(draggingY - $('button#spin').offset().top, draggingX - $('button#spin').offset().left);

			s_rad -= Math.atan2(clickedY - $('button#spin').offset().top, clickedX - $('button#spin').offset().left)
			
			addToStartAngle(s_rad/25);
			drawRouletteWheel();
		} 
	});
	$('#wheel').mouseup(function(e) {
		releasedX = e.pageX;
		releasedY = e.pageY;
		if(s_rad > 1.25) { // a minimum delta of rad = 1.25 required to drag around the wheel to count as a 'spin' 
			spin();
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