// INCLUDES
var libs = {
    portal: require('/lib/xp/portal'),
    content: require('/lib/xp/content'),
	thymeleaf: require('/lib/xp/thymeleaf'),
	data: require('/lib/enonic/util/data'),
    util: require('/lib/enonic/util/util')
};

// HARD-CODED SETTINGS
var hardCoded = {
	viewFile: 'googlemap.html',
	apiKey: 'AIzaSyCbb0hs5FZw7bgEM683i4lkSsgCP5l8AJk', // dev key belonging to bhj@enonic.com
	fallbackLat: '59.909195',
	fallbackLng: '10.742339'
}



function getLocations() {
	var config = libs.portal.getComponent().config;

	var locationConfigs = [{}];
	if ( config.locations ) {
		locationConfigs = libs.data.forceArray(config.locations);
	}
	
	var locations = [];
	for (var i = 0; i < locationConfigs.length; ++i) {
		var lat = locationConfigs[i].coordinates ? locationConfigs[i].coordinates.split(',')[0] : hardCoded.fallbackLat;
		var lng = locationConfigs[i].coordinates ? locationConfigs[i].coordinates.split(',')[1] : hardCoded.fallbackLng;

		var currentLocation = {
			name: locationConfigs[i].name,
			lat: lat,
			lng: lng,
			info:
				locationConfigs[i].info ?
					libs.portal.processHtml({
						value: locationConfigs[i].info
					})
				: ''
		};

		locations.push(currentLocation);
	}

	return locations;
}



function scriptAndCssTags() {
	var siteConfig = libs.portal.getSite().data.siteConfig.config;
	var apiKey = hardCoded.apiKey;

	var html = '';

	// Google Maps v3 JS API
	html += '<script src="https://maps.googleapis.com/maps/api/js?key=';
	html += apiKey;
	html += '&amp;callback=initGooglemaps" async="async" defer="defer"></script>';
	// init script
	html += '<script src="';
	html += libs.portal.assetUrl({ path: 'js/googlemaps.js' });
	html += '"></script>';
	// styles
	html += '<link rel="stylesheet" type="text/css" href="';
	html += libs.portal.assetUrl({ path: 'css/googlemaps.css' });
	html += '" />';

	return html;
}



// REQUEST HANDLING
exports.get = function(req) {
	
	var model = {
		locations: getLocations(),
		partConfig: libs.portal.getComponent().config,
		siteConfig: libs.portal.getSiteConfig()
	};

	// Fill possible null values with fallbacks
	if (! model.partConfig.theme ) model.partConfig.theme = 'original'
	if (! model.partConfig.zoom ) model.partConfig.zoom = 17

	libs.util.log(model);

	// Render response body
	var view = resolve(hardCoded.viewFile);
    var body = libs.thymeleaf.render(view, model);

    return {
    	body: body,
    	pageContributions: {
    		headEnd: scriptAndCssTags()
    	}
	};
};