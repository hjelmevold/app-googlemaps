// INCLUDES
var libs = {
    portal: require('/lib/xp/portal'),
    content: require('/lib/xp/content'),
	thymeleaf: require('/lib/xp/thymeleaf'),
	data: require('/lib/enonic/util/data'),
    util: require('/lib/enonic/util')
};

// HARD-CODED SETTINGS
var hardCoded = {
	viewFile: 'googlemap.html',
	fallbackLat: '59.909195',
	fallbackLng: '10.742339'
};



function getLocations(config) {

	var configLocations = [{}];
	if ( config.locations ) {
		configLocations = libs.data.forceArray(config.locations);
	}

	// Create and populate array with location objects
	var locations = [];
	configLocations.forEach(function(location) {
		locations.push(
			{
				name: location.name,
				lat: location.coordinates ? location.coordinates.split(',')[0] : hardCoded.fallbackLat,
				lng: location.coordinates ? location.coordinates.split(',')[1] : hardCoded.fallbackLng,
				markerIcon:
				    location.markerIcon ?
				        libs.portal.imageUrl({
                            id: location.markerIcon,
                            scale: 'block(30,30)'
                        })
                    : null,
				info:
					location.info ?
						libs.portal.processHtml({
							value: location.info
						})
					: ''
			}
		);
	});

	return locations;
}



function scriptAndCssMarkup() {
	var siteConfig = libs.portal.getSiteConfig();
	var apiKey = siteConfig.apiKey || '';

	var head = '', body = '';

	// Callback script
	head += '<script>function googlemapsCallback() { var targetMapContainers = document.querySelectorAll(".googlemap"); Array.prototype.forEach.call(targetMapContainers, initGooglemap); }</script>';
	// Init script
	head += '<script src="';
	head += libs.portal.assetUrl({ path: 'js/googlemaps.js' });
	head += '"></script>';
	// Styles
	head += '<link rel="stylesheet" type="text/css" href="';
	head += libs.portal.assetUrl({ path: 'css/googlemaps.css' });
	head += '" />';

	// Init script
	body += '<script src="https://maps.googleapis.com/maps/api/js?key=';
	body += apiKey;
	body += '&amp;callback=googlemapsCallback" async="async" defer="defer"></script>';

	return {
		headEnd: head,
		bodyEnd: body
	};

	// Google Maps v3 JS API
}



// REQUEST HANDLING
exports.get = function(req) {
    var partConfig = libs.portal.getComponent().config;
	var model = {
		locations: getLocations(partConfig),
		partConfig: partConfig,
		scriptAndCssMarkup: scriptAndCssMarkup(),
		maptype: partConfig.maptype || 'ROADMAP'
	};

	// Fill possible null values with fallbacks
	if (! model.partConfig.theme ) model.partConfig.theme = 'original';
	if (! model.partConfig.zoom ) model.partConfig.zoom = 17;

	// Render response body
	var view = resolve(hardCoded.viewFile);
    var body = libs.thymeleaf.render(view, model);

    return {
    	body: body,
    	pageContributions: {
    		headEnd: scriptAndCssMarkup().headEnd,
    		bodyEnd: scriptAndCssMarkup().bodyEnd,
    	}
	};
};
