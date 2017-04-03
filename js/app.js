var model = {
    locations: [{
            name: 'craft beer',
            address: 'granville island',
            location: {
                lat: 49.270999,
                lng: -123.105898
            },
            yelpTitle: 'craft-beer-market-vancouver-3'
        },
        {
            name: 'tap and barrel',
            address: 'downtown vancouver',
            location: {
                lat: 49.289365,
                lng: -123.116712
            },
            yelpTitle: 'tap-and-barrel-olympic-village-vancouver'
        },
        {
            name: 'steamworks',
            address: 'gastown',
            location: {
                lat: 49.284681,
                lng: -123.110780
            },
            yelpTitle: 'steamworks-brewing-company-vancouver-2'
        },
        {
            name: 'library square',
            address: 'downtown',
            location: {
                lat: 49.279806,
                lng: -123.114659
            },
            yelpTitle: 'library-square-public-house-vancouver'
        },
        {
            name: 'cinema public',
            address: 'main st',
            location: {
                lat: 49.280158,
                lng: -123.121305
            },
            yelpTitle: 'cinema-public-house-vancouver'
        },
        {
            name: 'new oxford',
            address: 'yaletown',
            location: {
                lat: 49.275845,
                lng: -123.121952
            },
            yelpTitle: 'the-new-oxford-vancouver'
        },
        {
            name: 'the park',
            address: 'west end',
            location: {
                lat: 49.286720,
                lng: -123.141296
            },
            yelpTitle: 'the-park-at-english-bay-vancouver'
        }
    ]
};


var map;
var markers = [];

var view = function(data) {
    this.name = ko.observable(data.name);
    this.showMe = ko.observable(true);
};


var vModel = {
    init: function() {
        var self = this;

        this.locationList = ko.observableArray([]);
        model.locations.forEach(function(Item) {
            self.locationList.push(new view(Item));
        });

        //credit to Karol, help building the click event
        this.selectedLocation = function() {
            var marker = this.marker;
            google.maps.event.trigger(marker, 'click');
        };

        //credit to Ryan Vrba, help building the filter function
        this.inputValue = ko.observable('');
        this.filteredTitles = ko.computed(function() {
            var filter = self.inputValue().toLowerCase();

            for (var i = 0; i < self.locationList().length; i++) {
                if (self.locationList()[i].name().toLowerCase().includes(filter) === true) {
                    self.locationList()[i].showMe(true);
                    if (self.locationList()[i].marker !== undefined) {
                        self.locationList()[i].marker.setVisible(true);
                    }
                } else {
                    self.locationList()[i].showMe(false);
                    self.locationList()[i].marker.setVisible(false);
                }
            }
        });

        this.renderMarker = function() {

            var largeInfoWindow = new google.maps.InfoWindow({
                maxWidth: 250
            });
            var bounds = new google.maps.LatLngBounds();
            var locations = model.locations;
            //create a marker for each location
            for (var i = 0; i < locations.length; i++) {
                var position = locations[i].location;
                var name = locations[i].name;
                var content = locations[i].content;
                var yelpTitle = locations[i].yelpTitle;

                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: name,
                    yelpTitle: yelpTitle,
                    animation: google.maps.Animation.DROP,
                    id: i,

                });
                markers.push(marker);
                //added marker attribute/property to location list
                self.locationList()[i].marker = marker;

                marker.setMap(map);

                bounds.extend(marker.position);

                marker.addListener('click', function() {
                    populateInfoWindow(this, largeInfoWindow);
                });
                marker.addListener('click', function() {
                    toggleBounce(this);
                });
                var yelp_url = 'https://api.yelp.com/v2/business/' + yelpTitle;
                getAjax(yelp_url, i);
                // console.log(i);
                // console.log(yelp_url);

            }
            map.fitBounds(bounds);


            function populateInfoWindow(marker, infowindow) {
                var name,rating,phone, address;

                name = marker.yelpData.name || 'no name provided';
                rating = marker.yelpData.rating_img_url_small || 'no rating available';
                phone = marker.yelpData.display_phone || 'no phone provided';
                address = marker.yelpData.location.display_address || 'no reviews at this time';

                content = ('<div>' + '<strong>' + name + ' ' + '</strong>');
                content += ('<br>' + '<img src="' + rating + '" alt="Number of yelp stars"' + '/>');
                content += ('<br>' + phone + '<br>' + address + '</div>');

                infowindow.marker = marker;
                infowindow.setContent(content);
                infowindow.open(map, marker);

            }

            function toggleBounce(marker) {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1400);
            }

        };

    }
};


var vM = new vModel.init();
ko.applyBindings(vM);


function initMap() {
    vancouverDowntown = {
        lat: 49.282455,
        lng: -123.1234
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: vancouverDowntown,
        zoom: 14
    });
    vM.renderMarker();
}
/**********************
      yelp api
      *************************/

function nonceGenerate() {
    return (Math.floor(Math.random() * 1e12).toString());
}

function getAjax(yelp_url, i) {

    var YELP_BASE_URL = "https://api.yelp.com/v2/";
    YELP_KEY = "3pizkICOmm2BBCD3iCFFfw";
    YELP_TOKEN = "DUKnfvHIOsLPslar31vZ6PH6ziQPz46I";
    YELP_KEY_SECRET = "LWluynOmA6VEwr9znKOgBQNclfI";
    YELP_TOKEN_SECRET = "ci0BcAtBzZV3OKvsRvGBS92TWMY";

    var parameters = {
        oauth_consumer_key: YELP_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: nonceGenerate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb' // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;


    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        dataType: 'jsonp',
        success: function(results) {
            // Do stuff with results
            markers[i].yelpData = results;
            // console.log(results);
        },
        error: function(error) {
            // Do stuff on fail
            markers[i].yelpData = 'error, data is not connecting'

        }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);
}

function googleError() {
    console.log('google error');
    alert('Sorry google maps is not connecting');
}