/******
neighborhood map
   ************/


var model = {
locations : [
    {   name : 'craft beer',
        address: 'granville island',
        location: {lat:49.270999, lng: -123.105898},
        content: ''
    },
    {
        name: 'tap and barrel',
        address: 'downtown vancouver',
        location: {lat:49.289365, lng: -123.116712},
        content:''
    },
    {
        name: 'steamworks',
        address: 'gastown',
        location: {lat:49.284681, lng: -123.110780},
        content: ''
    },
    {
        name: 'library square',
        address: 'downtown',
        location: {lat:49.279806, lng: -123.114659},
        content: ''
    },
    {
        name: 'cinema public',
        address: 'main st',
        location: {lat:49.280158, lng: -123.121305},
        content:''
    },
    {   name: 'new oxford',
        address: 'yaletown',
        location: {lat:49.275845, lng: -123.121952},
        content:''
    },
    {
        name: 'the park',
        address: 'west end',
        location: {lat:49.286720, lng: -123.141296},
        content:''
    }
    ]
};


var map;
var markers = [];

var titlesArray = model.locations.map(function(value) {
    return value.name;
});

var vModel = {
    init:function () {
    var self = this;

// filter function, binding ko to inputValue
  this.inputValue = ko.observable('');
    this.titles = ko.observableArray(titlesArray);
    this.filteredTitles = ko.computed(function(){
        for(var i = 0; i < markers.length; i++) {
            if(markers[i].title.toLowerCase().includes(self.inputValue().toLowerCase()) === false) {
                markers[i].setVisible(false);
            } else {
                markers[i].setVisible(true);
            }
        }
       return self.titles().filter(function(value){
           return value.toLowerCase().includes(self.inputValue().toLowerCase());
       });
    });

//credit to Karol, helping with building the click event
  this.selectedLocation = function () {
          var marker= this.marker;
          google.maps.event.trigger(marker, 'click');
        };


//list View
    this.locationList=ko.observableArray([]);
    model.locations.forEach(function(Item){
        self.locationList.push(new view.init(Item));
    });

    this.renderMarker= function() {

        var largeInfoWindow= new google.maps.InfoWindow({
          maxWidth: 250
        });
        var bounds = new google.maps.LatLngBounds();
        var locations=model.locations;
          //create a marker for each location
        for (var i=0 ; i < locations.length; i++) {
            var position = locations[i].location;
            var name = locations[i].name;
            var content = locations[i].content;
            //console.log(name);

         var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: name,
            content:content,
            animation: google.maps.Animation.DROP,

        });
         markers.push(marker);
         self.locationList()[i].marker=marker;

        bounds.extend(marker.position);

         marker.addListener('click', function(){
            populateInfoWindow(this, largeInfoWindow);
         });
         marker.addListener('click',function(){
            toggleBounce(this);
         });
      }
        map.fitBounds(bounds);

        function showListings() {
          var bounds= new google.maps.LatLngBounds();
          for(var i =0; i < markers.length; i++){
            markers[i].setMap(map);
            bounds.extend(markers[i].position);

          map.fitBounds(bounds);


        }
        }

        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', function() {
          hideListings(markers);
           function hideListings(marker) {
          for(var i = 0; i< markers.length; i++){
            markers[i].setMap(null);
          }
          }

        });

         function populateInfoWindow(marker, infowindow) {

        //if (infowindow.marker != marker) {
          infowindow.marker = marker;
          console.log(marker);
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
        //  Make sure the marker property is cleared if the infowindow is closed.
        //  infowindow.addListener('closeclick',function(){
        //  infowindow.setMarker = null;
         // });

            }

            function toggleBounce(marker){
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){marker.setAnimation(null);},1400);
            }

         }
        }
      }


var view = {
    init: function (data){
        this.name=ko.observable(data.name);
    },
}

var vM = new vModel.init();
ko.applyBindings(vM);


    function initMap() {
      vancouverDowntown = {lat: 49.282455, lng: -123.1234};
        map = new google.maps.Map(document.getElementById('map'), {
          center: vancouverDowntown,
          zoom: 14
        });
      vM.renderMarker();
      }

      /***********
      yelp api

      ********/




