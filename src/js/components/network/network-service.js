angular.module('FoodeeBuddee.services.Network', [])
  .service('NetworkService', function($interval, $cordovaNetwork, MessageService, deviceReady) {

    var timeOut = 1000;

    var locked = false;

    var service = function() {
      $interval(function() {
        deviceReady(function () {
          var networkState = navigator.connection.type;
          if (networkState === 'NONE' || networkState === 'none') {
            MessageService.flush('You are not connected to internet!', 'danger', true);
            locked = true;
          } else {
            if (locked) {
              MessageService.clear();
              locked = false;
            }
          }

        });
      }, timeOut);
    };

    return service;

  });