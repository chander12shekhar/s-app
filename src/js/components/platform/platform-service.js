angular.module('FoodeeBuddee.services.platform', [])
  .service('PlatformService', function (deviceReady) {
    var self = this;

    self.getPlatform = function() {
      return deviceReady(function() {
        var devicePlatform = device.platform;
        console.log(devicePlatform);
      });
    };

    return self;
  });