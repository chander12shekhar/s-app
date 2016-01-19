angular.module('FoodeeBuddee.services.User',[])

.service('UserService', function($http, SettingsService, StorageService, $q, $openFB, SubscriberService, UserModel, MessageService, $location) {

  var self = this;

  self.profile = {};
  self.provider = 'FOODEEBUDDEE';
  var profilePicturePath = '';


  self.isLogged = function() {
    return StorageService.getBoolean("logged");
  };


  self.register = function(user) {
    var req = {
     method: 'POST',
     url: SettingsService.rest_url + '/api/v1/create-user',
     data: user
    };
    return $http(req);
  };

  self.protectedResource = function() {
    var req = {
      method: 'GET',
      url: SettingsService.rest_url + '/api/v1/test'
    };
    return $http(req);
  };

  self.login = function(user) {
    var req = {
      method: 'POST',
      url: SettingsService.rest_url + '/api/v1/login',
      data: user
    };
    return $http(req);

  };

  self.persistProfile = function(provider) {
    self.provider = provider;
    $openFB.isLoggedIn()
    .then(function( loginStatus ) {
      fetchFBProfile();
      //fetchFBPicture();
    } , function( err ) {

    });
  };

  fetchFBProfile = function() {
    $openFB.api({path: '/me'})
      .then(function( res ) {
          angular.extend(self.profile, res);
          updateProfile();
          StorageService.setItem('logged', true);
          StorageService.setItem('user', self.profile);
          self.persistUser(self.profile)
        .success(function(response) {
          if(response.firstTimeLoginUser){
              self.profile.id = response.id;
              self.profile.token = response.token;
              angular.extend(self.profile, response.data);
              StorageService.setItem('user', response);
              StorageService.setItem('logged', true);
              SubscriberService.publish('login');
              $location.path('/add-spice');
          }
          else{
            angular.extend(self.profile, response.data);
            updateProfileMore(response);
            StorageService.setItem('user', response);
          }
        })
        .error(function(error) {
          MessageService.flush('Could not connect to FoodeeBuddee!', 'danger');
        });
        SubscriberService.publish('login');
      }, function( err ) {
          // error
    });
  };

  fetchFBPicture = function() {
    $openFB.api({
      path: '/me/picture',
      params: {
          redirect: false,
          width: 128,
          height: 128
      }
    }).then(function( res ) {
      StorageService.setItem('profileImage', res.data.url);
      var user = StorageService.getItem('user');
      user.mainImage = res.data.url;
      StorageService.setItem('user', user);
      SubscriberService.publish('login');
    }, function( err ) {
    });

  };

  var updateProfile = function() {
    var user = new UserModel();
    if(self.provider === 'FACEBOOK') {
      user.email = self.profile.email;
      user.firstName = self.profile.first_name;
      user.lastName = self.profile.last_name;
      user.socialProvider = self.provider;
      user.dateOfBirth = self.profile.birthday;
      user.gender = self.profile.gender;
      self.profile = user;
    }
  };

  var updateProfileMore = function(data) {
    if(data.socialProvider === 'FACEBOOK') {
      self.profile.mainImage = data.mainImage;
      self.profile.referralCode = data.referralCode;
      self.profile.currentLocationCountry = data.currentLocationCountry;
      self.profile.currentLocationState = data.currentLocationState;
      self.profile.currentCity = data.currentCity;
      self.profile.firstTimeLoginUser = data.firstTimeLoginUser;
      self.profile.token = data.token;
    }
  };

  self.persistUser = function(user) {
    var req = {
      method: 'POST',
      url: SettingsService.rest_url + '/api/v1/persist',
      data: user
    };
    return $http(req);
  };

    self.generateShortUrl = function(user){
      var longUrl = SettingsService.rest_url + '/foodee/' + user.aliasName;
      gapi.client.setApiKey('AIzaSyBhYxRJflds1A4HMqM2NzALwr-gxjAdmXk');
      gapi.client.load('urlshortener', 'v1');
      if( typeof gapi.client != 'undefined'){
          var interval = setInterval(function() {
              gapi.client.urlshortener.url.insert({
                  'longUrl': longUrl
              }).then(function(response) {
                var req = {
                    method: 'POST',
                    url: SettingsService.rest_url + '/api/v1/user/storeUrl/' + user.id,
                    data : {url : response.result.id}
                  };
                  $http(req)
                    .success(function(data){})
                    .error(function(data) {});
              });
              clearInterval(interval);
          },500);
      }
    };

  return {
    register: self.register,
    protectedResource: self.protectedResource,
    login: self.login,
    persistProfile: self.persistProfile,
    profile: self.profile,
    persistUser: self.persistUser,
    isLogged: self.isLogged,
    generateShortUrl: self.generateShortUrl
  };

});