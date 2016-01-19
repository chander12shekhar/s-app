angular.module('FoodeeBuddee.services.Authorization',[])

  .factory('AuthorizationService', function(StorageService, SubscriberService, MessageService, $location, NavigatorService, UserService, $cacheFactory) {

    var self = this;

    var observers = [];

    self.isLogged = function() {
      return StorageService.getBoolean('logged');
    };

    self.login = function(user) {

      var success = function(data, status) {
        if (status == '200') {
          if(data.mainImage === null ) data.mainImage = ' ';
          StorageService.setItem('user', data);
          StorageService.setItem('logged', true);
          SubscriberService.publish('login');
          MessageService.flush('Awesome! Start your food journey', 'warning', null, null);
          $location.path('/');
        } else if(status == '401') {
          MessageService.flush('Invalid login for ' + user.email, 'warning', null, null);
        }
      };

      var error = function(error, status) {
        // Handle this with a proper logging tool
        if(status == '401') {
          MessageService.flush('Invalid Username or Password!', 'danger');
        } else {
          MessageService.flush('Could not authorize! Please try again later!', 'danger');
        }
        $location.path('/login');
      };

      UserService.login(user)
        .success(success)
        .error(error);

    };

    self.logout = function() {
      self.clearCache();
      StorageService.setItem('logged', false);
      StorageService.removeItem('logged');
      SubscriberService.publish('login');
      StorageService.setItem('user', null);
      StorageService.removeItem('user');
      StorageService.setItem('profileImage', null);
      StorageService.removeItem('profileImage');
      StorageService.setItem('googleToken', null);
      StorageService.removeItem('googleToken');
      StorageService.setItem('vouchers', null);
      StorageService.removeItem('vouchers');
      NavigatorService.setCurrent('/');
      NavigatorService.setPrevious('/');
    };

    self.checkProtectedResource = function() {
      //    User
    };

    self.addObserver = function(observer) {
      observers.push(observer);
    };

    self.getObservers = function() {
      return observers;
    };

    self.updateObservers = function() {
      observers.forEach(function(callback) {
        callback();
      });
    };

    self.clearCache = function(){
      var $httpDefaultCache = $cacheFactory.get('$http');
      $httpDefaultCache.removeAll();
    };


    return {
      login: self.login,
      logout: self.logout,
      addObserver: self.addObserver,
      getObservers: self.getObservers,
      updateObservers: self.updateObservers
    }


  });