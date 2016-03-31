/*
TODO:

- querySelectorAll forEach .googlemap DONE
-- for now: only those on page load (not parts loaded through AJAX)
-- later: allow initGooglemaps() to be called again, only initializing new containers
--- can probably use Array.prototype.filter() for this somehow, or maybe simply have an if statement???

- retreive data attributes using getAttribute for IE support
-- https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
-- https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute

- if required attributes are not null, init a new map for that .googlemap
-- provide settings
--- variable with theme configs?
*/

var googlemapObjects = [];



function initGooglemaps() {
	var targetElements = document.querySelectorAll('.googlemap');
	Array.prototype.forEach.call(targetElements, initGooglemap);
}



function initGooglemap(currentMapTarget, index, allMapTargets) {
	var zoom = currentMapTarget.getAttribute('data-zoom') || 17;
	var theme = googlemapStyles[currentMapTarget.getAttribute('data-theme') || 'original'];

	// Initialize the map
	var map = new google.maps.Map(currentMapTarget, {
		center: new google.maps.LatLng(0, 0),
		fullscreenControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scrollwheel: false,
		styles: theme,
		zoom: zoom
	});

	// Used for dynamically calculating center
	var bounds = new google.maps.LatLngBounds();

	// Create markers
	var markerSources = currentMapTarget.previousElementSibling.querySelectorAll('dt');
	Array.prototype.forEach.call(markerSources, function(currentMarker, index, allMarkers) {

		var marker = new google.maps.Marker({
	        map: map,
	        position: {
	        	lat: parseFloat(currentMarker.getAttribute('data-lat')),
	        	lng: parseFloat(currentMarker.getAttribute('data-lng'))
	        },
	        title: currentMarker.innerText
	    });

		// Add infowindow if the following <dd> has HTML content
		if (currentMarker.nextElementSibling.innerHTML) {
			var infowindow = new google.maps.InfoWindow({
		    	content: currentMarker.nextElementSibling.innerHTML
		    });

		    google.maps.event.addListener(marker, 'click', function() {
		        infowindow.open(map, marker);
		    });
		}

	    // Extend the map bounds to include this marker's position
		bounds.extend(marker.position);
	});

	// Fit the map to the newly inclusive bounds
	map.fitBounds(bounds);



    // Re-center map on window resize
    google.maps.event.addDomListener(window, 'resize', function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
    });

	// (optional) Restore the zoom level after the map is done scaling
	var listener = google.maps.event.addListener(map, "idle", function () {
	    //map.setZoom(parseInt(currentMapTarget.getAttribute('data-zoom')) || 17);
	    google.maps.event.removeListener(listener);
	});

	googlemapObjects.push(map);
}

/* Themes */

var googlemapStyles = {

	// Simple hue changes
	// gamma-compensated: 1-( [luminance] +.06-.75)*2
	// where [luminance] is between .44 and .96 based on hue (see http://www.workwithcolor.com/color-luminance-2233.htm)
	
	original: [],
	red: [ { "stylers": [ { "hue": "#ff0000" }, { "gamma": 1.3 } ] } ],
	orange: [ { "stylers": [ { "hue": "#ff7700" }, { "gamma": 1.08 } ] } ],
	yellow: [ { "stylers": [ { "hue": "#ffff00" }, { "gamma": 0.5 } ] } ],
	green: [ { "stylers": [ { "hue": "#77ff00" }, { "gamma": 0.78 } ] } ],
	cyan: [ { "stylers": [ { "hue": "#00ffff" }, { "gamma": 0.64 } ] } ],
	blue: [ { "stylers": [ { "hue": "#0077ff" }, { "gamma": 1.24 }, ] } ],
	indigo: [ { "stylers": [ { "hue": "#0000ff" }, { "gamma": 1.5 }, ] } ],
	purple: [ { "stylers": [ { "hue": "#7700ff" }, { "gamma": 1.34 } ] } ],
	magenta: [ { "stylers": [ { "hue": "#ff00ff" }, { "gamma": 0.98 } ] } ],
	pink: [ { "stylers": [ { "hue": "#ff0077" }, { "gamma": 1.18 } ] } ],
	gray: [ { "stylers": [ { "saturation": -100 } ] } ],
	/*
	inverted: [ { "stylers": [ { "invert_lightness": true } ] } ],
	redInverted: [ { "stylers": [ { "hue": "#ff0000" }, { "invert_lightness": true } ] } ],
	orangeInverted: [ { "stylers": [ { "hue": "#ff7700" }, { "invert_lightness": true } ] } ],
	yellowInverted: [ { "stylers": [ { "hue": "#ffff00" }, { "invert_lightness": true } ] } ],
	greenInverted: [ { "stylers": [ { "hue": "#77ff00" }, { "invert_lightness": true } ] } ],
	cyanInverted: [ { "stylers": [ { "hue": "#00ffff" }, { "invert_lightness": true } ] } ],
	blueInverted: [ { "stylers": [ { "hue": "#0077ff" }, { "invert_lightness": true } ] } ],
	indigoInverted: [ { "stylers": [ { "hue": "#0000ff" }, { "invert_lightness": true } ] } ],
	purpleInverted: [ { "stylers": [ { "hue": "#7700ff" }, { "invert_lightness": true } ] } ],
	magentaInverted: [ { "stylers": [ { "hue": "#ff00ff" }, { "invert_lightness": true } ] } ],
	pinkInverted: [ { "stylers": [ { "hue": "#ff0077" }, { "invert_lightness": true } ] } ],
	grayInverted: [ { "stylers": [ { "saturation": -100 }, { "invert_lightness": true } ] } ],
	*/

	// SNAZZYMAPS THEMES

	// https://snazzymaps.com/style/39/paper
	paper: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"},{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]}],
	// https://snazzymaps.com/style/9/chilled
	chilled: [{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"hue":149},{"saturation":-78},{"lightness":0}]},{"featureType":"road.highway","stylers":[{"hue":-31},{"saturation":-40},{"lightness":2.8}]},{"featureType":"poi","elementType":"label","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"hue":163},{"saturation":-26},{"lightness":-1.1}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"hue":3},{"saturation":-24.24},{"lightness":-38.57}]}],
	// https://snazzymaps.com/style/119/mapbox-clean
	mapboxClean: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#EBE5E0"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]}],
	// https://snazzymaps.com/style/22/old-timey
	oldTimey: [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-77}]},{"featureType":"road"}],
	// https://snazzymaps.com/style/4069/navigation
	navigation: [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"gamma":0.01},{"lightness":20}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"saturation":-31},{"lightness":-33},{"weight":2},{"gamma":0.8}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#050505"}]},{"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"color":"#fef3f3"},{"weight":"3.01"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#0a0a0a"},{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.stroke","stylers":[{"color":"#fffbfb"},{"weight":"3.01"},{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":30},{"saturation":30}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":20}]},{"featureType":"poi.attraction","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"lightness":20},{"saturation":-20}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":10},{"saturation":-30}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"saturation":25},{"lightness":25}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#a1a1a1"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#292929"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#202020"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"simplified"},{"hue":"#0006ff"},{"saturation":"-100"},{"lightness":"13"},{"gamma":"0.00"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#686868"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"color":"#8d8d8d"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#353535"},{"lightness":"6"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":"3.45"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#d0d0d0"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"lightness":"2"},{"visibility":"on"},{"color":"#999898"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#383838"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"color":"#faf8f8"}]},{"featureType":"water","elementType":"all","stylers":[{"lightness":-20}]}],
	// https://snazzymaps.com/style/107/blue-ish
	blueIsh: [{"stylers":[{"saturation":-45},{"lightness":13}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#8fa7b3"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#667780"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#8fa7b3"},{"gamma":2}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#a3becc"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7a8f99"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#a3becc"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7a8f99"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#bbd9e9"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#525f66"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"color":"#bbd9e9"},{"gamma":2}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"color":"#a3aeb5"}]}],
	// https://snazzymaps.com/style/70/unsaturated-browns
	unsaturatedBrowns: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}],
	// https://snazzymaps.com/style/151/ultra-light-with-labels
	ultraLightWithLabels: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
	// https://snazzymaps.com/style/37/lunar-landscape
	lunarLandscape: [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}],
	// https://snazzymaps.com/style/89/green
	snazzyGreen: [{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#bbd5c5"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#808080"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fcf9a2"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#bbd5c5"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#808080"}]}],
	// https://snazzymaps.com/style/12/snazzy-maps
	snazzyMaps: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#333739"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2ecc71"}]},{"featureType":"poi","stylers":[{"color":"#2ecc71"},{"lightness":-7}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-28}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"visibility":"on"},{"lightness":-15}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-18}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-34}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#333739"},{"weight":0.8}]},{"featureType":"poi.park","stylers":[{"color":"#2ecc71"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#333739"},{"weight":0.3},{"lightness":10}]}],
	// https://snazzymaps.com/style/2/midnight-commander
	midnightCommander: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}],
	// https://snazzymaps.com/style/15/subtle-grayscale
	subtleGrayscale: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],
	// https://snazzymaps.com/style/25246/apple-maps-esque
	appleMapsEsque: [{"featureType":"landscape.man_made","elementType":"all","stylers":[{"color":"#faf5ed"},{"lightness":"0"},{"gamma":"1"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5a6"}]},{"featureType":"road","elementType":"all","stylers":[{"weight":"1.00"},{"gamma":"1.8"},{"saturation":"0"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ffb200"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"0"},{"gamma":"1"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"hue":"#b000ff"},{"saturation":"23"},{"lightness":"-4"},{"gamma":"0.80"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#a0daf2"}]}]
};


