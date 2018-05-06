var map;

function initMap() {
    // Constructor creates a new map   
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.913611, 
            lng: 4.495833
        },
        zoom: 13,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // hide existing points of interests (poi)
        styles: [{
            featureType: "poi",
            elementType: "labels",
            stylers: [{ 
                visibility: "off"
            }]
        }]
    });

    ko.applyBindings(new ViewModel());
};

// Toggle the animation between a BOUNCE animation and no animation
// Bounce for 2800 msec
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2800);
    }
};

// This function populates the infowindow when the marker is clicked. 
// We'll only allow one infowindow which will open at the marker that is 
// clicked, and populate based on that markers position.
function populateInfoWindow(marker, infowindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // toggle the bounce animation for the marker
        toggleBounce(marker);
        infowindow.setContent();
        infowindow.marker = marker;

        // set the variables for the foursquare API call
        var client_id = "D3THGIYACA1OTWAKR3DA3TWYTFSOUAKQ1HMT0MGMIHOIEC53";
        var client_secret = "SEVXOGG1FZAWHJG4RBGFW4VDDKQH55RWHLQWBRVGG3ZENEXX";
        var base_url = "https://api.foursquare.com/v2/";
        var endpoint = "venues/search?";
        var key = 
            "&client_id=" + client_id + 
            "&client_secret=" + client_secret + 
            "&v=" + "20180505";
        var params =
            "ll=" + 
                marker.getPosition().lat() + "," + 
                marker.getPosition().lng() +
            "&intent=" + "match" +
            "&name=" + 
                marker.title +
            "&limit=" + "1";

        // create the API url for the 'search for venues' call
        var fsSearchVenuesUrl = base_url + endpoint + params + key;

        // AJAX request for getting Foursquare Venue informations
        $.getJSON(fsSearchVenuesUrl, function(data) {
            var venue = data.response.venues[0];
            var innerHTML = "<div><strong>" + venue.name + "</strong>";
            
            if (venue.location.address) {
                innerHTML += "</br>" + venue.location.address;
            };

            if (venue.location.postalCode) {
                innerHTML += "</br>" + venue.location.postalCode;
            };

            if (venue.location.city) {
                innerHTML += " " + venue.location.city;
            };

            if (venue.url) {
                innerHTML += "</br>" + 
                    "<a href=" + venue.url + " target='_blank'>" + venue.url + 
                    "</a>";
            };

            // new endpoint and parameter forsquare request
            endpoint = "venues/" + venue.id + "/photos?";
            params =
                "&group=" + "venue" + 
                "&limit=" + "1";

            // create the API url for the 'get a venue's photo' call
            var fsGetVenuesPhotoUrl = base_url + endpoint + params + key;

            // initialise a variable to capture photo of venue
            var venuePhoto = [];

            // doing a synchronous request to load photo within the initial 
            // asynchronous request.This prevents race condition
            $.ajax({
                async: false,
                url: fsGetVenuesPhotoUrl
            // when ok call
            }).done(function(data) {
                venuePhoto = data.response.photos.items[0];
            // when failure call; show error
            }).fail(function(jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
                alert('The request to Foursquare failed');
            });

            if (venuePhoto.prefix) {
                innerHTML += "</br></br>" +
                    "<img src=" + venuePhoto.prefix + 
                    "height100" + venuePhoto.suffix + ">";
            };

            // Attribution for using foursquare
                innerHTML += "</br></br>" +
                    "<img src=img/Powered-by-Foursquare.png" +
                    " width=150 height=30></div>";

            infowindow.setContent(innerHTML);

        // when failure call; show error
        }).fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
            alert('The request to Foursquare failed');
        });

        infowindow.open(map, marker);
    
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function() {
            infowindow.setMarker = null;
        });
    }
};

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
};

// Set the initial locations for the map markers
var initialLocations = [
    {  
        title: "Stadion Feijenoord",
        location: { 
            lat: 51.89381481384923, 
            lng: 4.523062705993652 
        }
    },{   
        title: 'Erasmusbrug',
        location: { 
            lat: 51.909135466826044,
            lng: 4.485829814949875 
        }
    },{
        title: 'Station Rotterdam Centraal',
        location: { 
            lat: 51.92488157654307, 
            lng: 4.46939549432236 
        }
    },{
        title: 'Bar Hotel New York',
        location: { 
            lat: 51.90402740342993, 
            lng: 4.484449052981197 
        }
    },{
        title: 'Nieuwe Luxor Theater',
        location: { 
            lat: 51.90673712416364, 
            lng: 4.4910478591918945 
        }
    },{
        title: 'Stadhuis',
        location: { 
            lat: 51.922810498459185, 
            lng: 4.479541816291958 
        }
    },{
        title: 'Euromast',
        location: { 
            lat: 51.905364748223356, 
            lng: 4.466731814270059 
        }
    },{
        title: 'Van Nelle Fabriek',
        location: { 
            lat: 51.923622117835954, 
            lng: 4.432585583975868 
        }
    },{
        title: 'Markthal',
        location: { 
            lat: 51.920137480908274, 
            lng: 4.48725882417661
        }
    },{
        title: 'Diergaarde Blijdorp',
        location: { 
            lat: 51.927242456933314, 
            lng: 4.449304770218021 
        }
    }
];

// functions to set the location
var Location = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.marker = ko.observable;
};

var ViewModel = function() {
    var self = this;

    // google maps attributes
    var largeInfowindow = new google.maps.InfoWindow();

    // This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // create a observableArray for the locationlist 
    self.locationList = ko.observableArray([]);
    
    // create a property to store the filter
    self.filterText = ko.observable("");
    
    // loop over the initial locations to add them to the locationlist
    initialLocations.forEach(function(location) {
        self.locationList.push(new Location(location));
    });

    // Loop over the locationList and create a marker for each location
    self.locationList().forEach(function(location) {
        var marker = new google.maps.Marker( {
            //map: map,
            position: location.location(),
            title: location.title(),
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
        });
        location.marker = marker;

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {

            // Make sure all marker animations have been switched off
            self.locationList().forEach(function(location) {
                location.marker.setAnimation(null)
            });
            populateInfoWindow(this, largeInfowindow);
        });

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
          this.setIcon(highlightedIcon);
        });
        
        marker.addListener('mouseout', function() {
          this.setIcon(defaultIcon);
        });
    });

     
    // a location from the list has been selected by the user
    self.locationListSelected = function(location) {
            // Make sure all marker animations have been switched off
            self.locationList().forEach(function(location) {
                location.marker.setAnimation(null)
            });

            populateInfoWindow(location.marker, largeInfowindow);
    };

    // filter the list based on user input (filterText)
    self.locationListFiltered = ko.computed(function() {
        var bounds = new google.maps.LatLngBounds();
        var filter = self.filterText().toLowerCase();
        if (!filter) {
            self.locationList().forEach(function(location) {
                location.marker.setMap(map);
                bounds.extend(location.marker.position);
            });
            
            // Extend the boundaries of the map for each marker
            map.fitBounds(bounds);
            return self.locationList();
        } else {

            // show list items based on filter input
            // hide or show markers based on filter input
            return ko.utils.arrayFilter(self.locationList(), 
                function(location) {
                
                    if (location.title().toLowerCase().indexOf(
                        filter.toLowerCase()) !== - 1) {
                        location.marker.setMap(map);
                        return true;    
                    } else {
                        location.marker.setMap(null);              
                        return false;
                    }
                }
            );
        }
    }, self);
}; 
