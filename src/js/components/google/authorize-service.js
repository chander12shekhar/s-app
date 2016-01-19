angular.module('FoodeeBuddee.services.Google', [])

  .service('GoogleService',
    function (StorageService, $rootScope, $q, $http, UserModel, SubscriberService, $location, UserService,
              AppBrowserProvider, $timeout, MessageService, SettingsService, $window, $cordovaOauth) {
      //TODO: Add inAppBrowser logic
      var self = this;

      self.profile = '';

      var client_id = SettingsService.googleClientId;

      var scope = ['email', 'profile'];

      var setToken = function (data) {
        StorageService.setItem('googleToken', data.access_token);
      };


      var getToken = function (options) {
        return StorageService.getItem('googleToken');
      };

      var userInfo = function (options) {
        var req = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + options.access_token;
        $http.get(req)
          .success(function (data) {
            updateProfile(data);
            $location.path("/");
          })
          .error(function (error) {

          });
      };

      self.handleAuthResult = function (e) {
        //console.log(e);
      };


      self.login = function () {

        $cordovaOauth.google(client_id, scope).then(function (data) {
          setToken(data);
          userInfo(data);
        }, function (error) {
          console.log("Error -> " + error);
        });

      };

      var updateProfile = function (data) {
        var user = new UserModel();
        user.email = data.email;
        user.firstName = data.given_name;
        user.lastName = data.family_name;
        user.gender = data.gender;
        user.socialProvider = 'GOOGLE';
        self.profile = user;
        self.profile.mainImage = data.picture;
        StorageService.setItem('user', self.profile);
        StorageService.setItem('logged', true);
        StorageService.setItem('profileImage', data.picture);
        UserService.persistUser(user)
          .success(function (data) {
            data.mainImage = StorageService.getItem('profileImage');
            StorageService.setItem('user', data);
            if (data.firstTimeLoginUser) {
              StorageService.setItem('logged', true);
              SubscriberService.publish('login');
              $location.path('/add-spice');
            }
          })
          .error(function (err) {
            console.log(err);
          });
        SubscriberService.publish('login');
      };

      return {
        login: self.login
      };


    });