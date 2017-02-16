# Google Maps app for Enonic XP version 6

This Enonic XP application contains a Google Maps part that you may add to your [Enonic XP](https://github.com/enonic/xp) site.

## Features
* Supports multiple locations in a single map
* Each location may have its own marker icon and info window
* Supports multiple maps (parts) on the same page
* Responsive design where the map scales according to available width
* Map area may have one of four aspect ratios
* Screen reader compatible markup
* Fullscreen toggle button has been enabled by default
* Scrolling/swiping zoom controls are disabled, so users don't get stuck inside the map
* Several color themes are available, including more elaborate ones from snazzymaps.com

## Installation

There are three options:

* First option is to open the Enonic XP Application Admin Tool. In here select "Install" and find this app in the Market list of available apps.
* Second alternative is to simply download the app [JAR file](http://repo.enonic.com/public/com/enonic/app/googlemaps/1.0.1/googlemaps-1.0.1.jar) and move it to the XP installation's `$XP_HOME/deploy` folder.
* Or you can build this app with gradle. First, download the zip file of this repo. Unpack it locally. In the terminal, from the root of the project, type `./gradlew build`. On Windows, just type `gradlew build`. Next, move the JAR file from `build/libs` to your `$XP_HOME/deploy` directory. The Google Maps app will now be available to add to your websites through the Content Manager admin tool in Enonic XP.

If you are upgrading to a newer version of this app, make sure to remove the old version's JAR file from the `$XP_HOME/deploy` directory.

## How to use this app

### Usage limits set by Google
The standard usage limits for Google Maps is [25,000 map loads per 24 hours for 90 consecutive days](https://developers.google.com/maps/documentation/javascript/usage). If this limit is exceeded, you may enable pay-as-you-go billing to unlock higher quotas.

### Google Maps JavaScript API v3 Browser Key
While strictly not required for Google Maps to run, Google *strongly recommends* that you [create an API key](https://developers.google.com/maps/documentation/javascript/get-api-key#key) so you can perform tracking and analysis, as well as unlock additional quotas if you surpass the usage limit. Once you have obtained an API key, it may be entered in this app's App config when editing your site.

### How to find GPS coordinates for a location
* Visit [Google Maps](https://www.google.com/maps) and search for your location (address, location name, etc.)
* Right-click inside the map on the location that you want the GPS coordinates to point to
* In the context menu that appears, choose "What's here?"
* A pop-up window appears that should include two decimal numbers separated by a comma, e.g. `59.909195, 10.742339`. These are your coordinates. If you like, you may click on the numbers and Google Maps will put them in the search field so you may easily copy them to the clipboard.
* When creating your Google Maps part in Page Edit, these GPS coordinates may be typed/pasted into any "GPS coordinates" field.

## Troubleshooting

### Map does not appear while in Page Edit mode
Make sure to hit Apply, then Save Draft. The preview area should then reload and the map should appear. It this does not help, try refreshing the browser window/tab.

## Releases and Compatibility

| Version        | XP version |
| ------------- | ------------- |
| 1.2.0 | 6.7.0 |
| 1.1.0 | 6.7.0 |
| 1.0.1 | 6.4.0 |
| 1.0.0 | 6.4.0 |

**Important!** This App is not backwards compatible with any XP version before 6.7.

## Changelog

### Version 1.2.0

* Each location may now have its own custom marker icon image
* Added map type setting (road, sattelite, hybrid, terrain)
* More reliable map loading behavior

### Version 1.1.0

* Application icon for Enonic XP version 6.7 and later

### Version 1.0.1

* Fixed bug when placing a part on a page with multiple regions

### Version 1.0.0

* First release
