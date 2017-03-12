/******
neighborhood map
   ************/

var model = {
locations : [
    {   name : 'craft beer',
        address: 'granville island',
    },
    {
        name: 'tap and barrel',
        address: 'downtown vancouver'
    },
    {
        name: 'steamworks',
        address: 'gastown'
    },
    {
        name: 'tiki room',
        address: 'main st'
    },
    {
        name: 'brickhouse',
        address: 'main st'
    },
    {    name: 'cascade room',
        address: 'main st'
    },
    {
        name: ' nomad',
        address: 'main st'
    }
    ]
};

var vModel = {
    init:function () {
    var self = this;

    this.locationList=ko.observableArray([]);
    model.locations.forEach(function(Item){
        self.locationList.push(new view.init(Item));
    });
  }
}

var view = {
    init: function (data){
        this.name=ko.observable(data.name);
    },
}

ko.applyBindings(new vModel.init());

 var map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 49.282455, lng: -123.123475},
          zoom: 14
        });
      }
