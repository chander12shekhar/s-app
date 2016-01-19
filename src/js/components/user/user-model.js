angular.module('FoodeeBuddee.services.UserModel',[])

.factory('UserModel', function($http, SettingsService, StorageService, $q, $openFB, SubscriberService) {

  var user = function() {
    var self = this;
    self.email = '';
    self.lastName = '';
    self.firstName = '';
    self.socialProvider = '';
    self.password = '';
    self.token = '';
    self.mainImage = '';
    self.referralCode = '';
    self.dateOfBirth = '';
    self.gender = '';
    self.firstTimeLoginUser = false;
    self.currentLocationCountry = '';
    self.currentLocationState = '';
    self.currentCity = '';
    self.lat = 0.0;
    self.lng = 0.0;
  };

  return user;

});