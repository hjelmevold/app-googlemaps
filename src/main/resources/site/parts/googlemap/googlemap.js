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
}



function getLocations() {
	var config = libs.portal.getComponent().config;

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

	var html = '';

	// Callback script
	html += '<script>function googlemapsCallback() { var targetMapContainers = document.querySelectorAll(".googlemap"); Array.prototype.forEach.call(targetMapContainers, initGooglemap); }</script>'
	// Google Maps v3 JS API
	html += '<script src="https://maps.googleapis.com/maps/api/js?key=';
	html += apiKey;
	html += '&amp;callback=googlemapsCallback" async="async" defer="defer"></script>';
	// Init script
	html += '<script src="';
	html += libs.portal.assetUrl({ path: 'js/googlemaps.js' });
	html += '"></script>';
	// Styles
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
		locations: getLocations(),
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
