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
	viewFile: 'googlestreetview.html',
	apiKey: 'AIzaSyCbb0hs5FZw7bgEM683i4lkSsgCP5l8AJk', // dev key belonging to bhj@enonic.com
	fallbackLat: '59.908969',
	fallbackLng: '10.742523'
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



function scriptAndCssMarkup() {
	var siteConfig = libs.portal.getSite().data.siteConfig.config;
	// TODO: retrieve apiKey from siteConfig
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



function isLastAppPartOnPage() {
	var isLast = false;

	var page = libs.portal.getContent().page;
	var part = libs.portal.getComponent();

	var appParts = [];
	
	// Iterate through all components on page
	if ( page.regions ) {
		// TODO: test what happens when more than one region
		for ( var regionName in page.regions ) {
			if ( page.regions[regionName].components ) {
				var components = libs.data.forceArray(page.regions[regionName].components);

				components.forEach( function(component) {
					// Add component if it belongs to this app
					if ( component.descriptor.indexOf(app.name) !== -1 ) {
						appParts.push(component);
					}
				} );
			}
		}
	}
	
	// Test if current part is last (of all parts from this app)
	if ( appParts[appParts.length - 1].path === part.path ) isLast = true;

	return isLast;
}



// REQUEST HANDLING
exports.get = function(req) {

	var model = {
		isLast: isLastAppPartOnPage(), // App scripts/css will only be included once
		location: {
			lat: hardCoded.fallbackLat,
			lng: hardCoded.fallbackLng
		},
		partConfig: libs.portal.getComponent().config,
		scriptAndCssMarkup: scriptAndCssMarkup(),
		siteConfig: libs.portal.getSiteConfig()
	};

	// Fill possible null values with fallbacks
	if (! model.partConfig.theme ) model.partConfig.theme = 'original';
	if (! model.partConfig.zoom ) model.partConfig.zoom = 17;

	// Render response body
	var view = resolve(hardCoded.viewFile);
    var body = libs.thymeleaf.render(view, model);

    return {
    	body: body
    	// Disabled due to buggy reload behavior in Page Edit (replaced by isLast-logic in the view)
    	/*,
    	pageContributions: {
    		headEnd: scriptAndCssMarkup()
    	}
    	*/
	};
};