angular.module('FoodeeBuddee.services.location', [])
  .service('LocationService', function($cordovaGeolocation, MessageService, $location) {
    var self = this;

    var options = {
      timeout : 10000,
      enableHighAccuracy: false // Set to true can cause location problems
    };

    self.locality = '';
    self.cityVal = '';
    self.stateVal = '';
    self.countryVal = '';
    self.zipVal = '';

    /**
     * @returns {*|HttpPromise|void}
     */
    self.currentLocation = function() {
      return $cordovaGeolocation
        .getCurrentPosition(options);
    };

    self.getLocationDetails = function(latitude, longitude) {
      var latlng = new google.maps.LatLng(latitude, longitude);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {'latLng': latlng},
        function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              for(var i = 0; i < results[0].address_components.length; i++) {
                if(results[0].address_components[i].types[0] == "country") {
                  self.countryVal = (results[0].address_components[i].long_name);
                }
              }
              var add= results[0].formatted_address ;
              var  value=add.split(",");
              count = value.length;
              if(value[count - 4] !== undefined){
                self.locality = value[count - 4];
              }
              if(value[count-2] !== undefined){
                self.stateVal = value[count-2];
              }
              if(value[count-3] !== undefined){
                self.cityVal = value[count-3];
              }
              pin = self.stateVal.split(" ");
              self.zipVal = pin[pin.length-1];
              self.stateVal = self.stateVal.replace(self.zipVal,' ');
            }
            else  {
              MessageService.flush('Could not find your location!, danger');
            }
          }
          else {
            console.log("Geocoder failed due to: " + status);
          }
        }
      );

    };

    return self;
  });