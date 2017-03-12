/******
neighborhood map
   ************/

var model = {
locations : [
    {   name : 'craft beer',
        address: 'granville island',
        location: {lat:49.283, lng: -123.123}
    },
    {
        name: 'tap and barrel',
        address: 'downtown vancouver',
        location: {lat:49.283, lng: -123.125}
    },
    {
        name: 'steamworks',
        address: 'gastown',
        location: {lat:49.283, lng: -123.127}
    },
    {
        name: 'tiki room',
        address: 'main st',
        location: {lat:49.283, lng: -123.129}
    },
    {
        name: 'brickhouse',
        address: 'main st',
        location: {lat:49.283, lng: -123.131}
    },
    {   name: 'cascade room',
        address: 'main st',
        location: {lat:49.283, lng: -123.133}
    },
    {
        name: 'nomad',
        address: 'main st',
        location: {lat:49.283, lng: -123.139}
    }
    ]
};
var map;
var markers = [];
var vModel = {
    init:function () {
    var self = this;

    this.locationList=ko.observableArray([]);
    model.locations.forEach(function(Item){
        self.locationList.push(new view.init(Item));
    });

    this.renderMarker= function() {

        var largeInfoWindow= new google.maps.InfoWindow();
        var locations=model.locations;
        for (var i=0 ; i < locations.length; i++) {
            var position = locations[i].location;
            var name = locations[i].name;
            //console.log(name);

         var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: name,
            animation: google.maps.Animation.DROP,

        });

         console.log(marker);
         markers.push(marker);
        }

         marker.addListener('click', function(){
            populateInfoWindow(this, largeInfoWindow);
         });

         function populateInfoWindow(marker, infowindow){
            if(infowindow.marker != marker){
                infowindow.marker=marker;
                infowindow.setContent('<div>' + marker.title + '</div>');
                infowindow.open(map, marker);
                infowindow.addListener('closeclick',function(){
                infowindow.setMarker = null;
                });

            }
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
ko.applyBindings(new vModel.init());


    function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 49.282455, lng: -123.1234},
          zoom: 14
        });
      vM.renderMarker();
      }
