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
	fallbackCoords: '59.909195,10.742339'
}



function getSettings() {
	var siteConfig = libs.portal.getSite().data.siteConfig.config;
	var partConfig = libs.portal.getComponent().config;

	return {
		siteConfig: siteConfig,
		partConfig: partConfig
	};
}



function getLocations() {
	var config = libs.portal.getComponent().config;

	//libs.util.log(config);
	
	// Handle null, one, or multiple entries
	var locationConfigs = [{}];
	if ( config.locations ) {
		locationConfigs = libs.data.forceArray(config.locations);
	}
	
	var locations = [];
	for (var i = 0; i < locationConfigs.length; ++i) {
		
		var currentLocation = {
			name: locationConfigs[i].name,
			location: locationConfigs[i].coordinates || hardCoded.fallbackCoords,
			infobubble:
				locationConfigs[i].infobubble ?
					libs.portal.processHtml({
						value: locationConfigs[i].infobubble
					})
				: null
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
		settings: getSettings(),
		locations: getLocations()
	};

	//libs.util.log(model);

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