angular.module('FoodeeBuddee.controllers.SocialCheckinFinal', [])
  .controller('SocialCheckinFinalController', function (StorageService, SocialPostService, MessageService, $location, NavigatorService, SearchService, SubscriberService) {
    var self = this;

    NavigatorService.setCurrent('socials/checkin/finalize');
    NavigatorService.setPrevious('/socials/checkin');

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.user = StorageService.getItem('user');
    self.eatery = SocialPostService.eatery;

    self.checkInfo = {status:'', eatery:self.eatery};

    self.checkin = function() {
      SocialPostService.checkin(self.checkInfo)
        .success(function(result) {
          MessageService.flush('You Checked-In successfully!', 'success');
          $location.path('/social');
        })
        .error(function(result) {
          MessageService.flush('Something went wrong. Please try again later!', 'failure');
        });
    };

    self.position = function (eatery) {
      if (!eatery) return '';
      return self.hasLocation(eatery) ?
        eatery.address.lat + ', ' + eatery.address.lng :
        eatery.address.locality + ', ' + eatery.address.city;
    };

    self.hasLocation = function (eatery) {
      return !!eatery && !!eatery.address && !!eatery.address.lat && !!eatery.address.lng;
    };

    self.cancel = function() {
      $location.path('/socials/checkin');
    };

  });