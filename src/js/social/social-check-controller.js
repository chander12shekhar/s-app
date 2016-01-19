angular.module('FoodeeBuddee.controllers.SocialCheck', [])
  .controller('SocialCheckController', function (StorageService, deviceReady, SocialPostService, MessageService, $location,
                                                 $cordovaImagePicker, CameraService, $base64, LocationService, $routeParams, NavigatorService, SearchService, SubscriberService) {
    var self = this;

    NavigatorService.setCurrent('socials/checkin');
    NavigatorService.setPrevious('/social');

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.user = StorageService.getItem('user');
    self.busy = true;

    self.eateryList = [];
    self.checkinResults = 0;
    self.checkInfo = {status:'', eatery:{}};
    self.currentLocationCoords = '';

    var action = $routeParams.slug;

    self.selectEatery = function(eatery) {
      SocialPostService.eatery = eatery;
      $location.path('/socials/checkin/finalize');
    };

    if(action === undefined || action == null) {
      LocationService.currentLocation()
        .then(function(result) {
          self.currentLocationCoords = result.coords.latitude + ', ' + result.coords.longitude;
          SocialPostService.getCheckinSuggestions(result.coords)
            .success(function(result) {
              self.eateryList = result;
              self.checkinResults = result.length;
              self.checkInfo.eatery = result.length == 1 ? result[0] : {};
              self.busy = false;
            })
            .error(function(err, status) {
              self.busy = false;
            });
        },function(err) {
          MessageService.flush('Could not pick your Location. Please try again later!', 'danger');
          $location.path('/social');
        }
      );
    } else {
      self.checkInfo.eatery = SocialPostService.eatery;
    }

    self.checkinPage = function() {
      $location.path('/socials/checkin');
    };

    self.cancel = function() {
      $location.path('/social');
    }
  });