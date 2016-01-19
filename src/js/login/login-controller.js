angular.module('FoodeeBuddee.controllers.Login', [])
  .controller('LoginController', function ($cordovaOauth, AuthorizationService, StorageService, $location, $openFB, UserService,
                                           SubscriberService, GoogleService, $q, SettingsService, MessageService, $http, $cordovaSocialSharing, NavigatorService, $cordovaDialogs) {

    var self = this;

    self.user = StorageService.getItem('user');
    self.type = 'password';
    self.showPassword = false;
    self.data = '';

    self.logged = StorageService.getBoolean('logged');

    self.profileImage = StorageService.getItem('profileImage');

    self.baseUrl = 'https://www.foodeebuddee.com';


    NavigatorService.setPrevious('/');

    $openFB.init({appId: SettingsService.facebookAppId});

    SubscriberService.subscribe('login', function () {
      self.logged = StorageService.getBoolean('logged');
      self.profileImage = StorageService.getItem('profileImage');
      self.user = StorageService.getItem('user');
    });

    self.facebookLogin = function () {
      $openFB.login({scope: 'email, user_birthday, user_friends'})
        .then(function (token) {
          UserService.persistProfile("FACEBOOK");
          $location.path('/');
        }, function (err) {
        })
    };

    self.toggleType = function (ele) {
      $("#"+ele).toggleClass("switchOn");
      self.type = self.showPassword === true ? 'text' : 'password';
    };

    self.googleLogin = function () {
      GoogleService.login();
    };

    self.login = function () {
      AuthorizationService.login(self.user);
    };

    self.logout = function () {
      if(NavigatorService.isPrevent()){
        var message  = 'Are you sure you want to cancel?';
        var buttonArray  = ['YES', 'NO'];
        $cordovaDialogs.confirm(message, buttonArray)
          .then(function(buttonIndex) {
            if(buttonIndex == 1){
              NavigatorService.setPrevent(false);
              AuthorizationService.logout();
              $location.path('/');
            }
          });
      }
      else {
        AuthorizationService.logout();
        $location.path('/');
      }
    };

    self.socialAction = function () {
      if (self.logged == true) {
        if(NavigatorService.isPrevent()){
            self.prevent('/social');
        }
        else{
            $location.path('/social');
        }
      }
      else {
        $location.path('/login');
        MessageService.flush('Please SIGN IN to access your Posts!', 'warning', null, null);
      }
    };

    self.leaderboardAction = function () {
      if(self.logged){
        if(NavigatorService.isPrevent()){
            self.prevent('/leaderboard/me');
        }
        else{
            $location.path('/leaderboard/me');
        }
      }
      else{
        MessageService.flush('Please SIGN IN to view your Leaderboard!', 'warning', null, function () {
          $location.path('/login');
        });
      }
    };

    self.recipeAction = function () {
      MessageService.flush('We will serve you pretty soon!', 'warning', null, null);
    };

    self.forgotPassword = function () {
      valid = true;
      if(self.data.email !='' && typeof self.data.email != 'undefined' ) {
        self.checkEmailFormat('FEmail');
        if(valid){
          var req = {
            method: 'POST',
            url: SettingsService.rest_url + '/api/v1/forgotPasswordApp',
            data: {email: self.data.email}
          };
          $http(req)
            .success(function (data) {
              MessageService.flush(data.message, 'success');
              if(data.messageType == 'success') {
                $location.path('/login');
              }
            })
            .error(function (data) {
              MessageService.flush('Something went wrong. Please try again later!', 'danger');
            });
        }
      } else {
        $(".FEmail").addClass('error');
        MessageService.flush('Please enter your email id!', 'warning');
      }

    };

    self.checkEmailFormat = function(ele){
      var pattern = new RegExp(/^([A-Za-z0-9._]+@([\w-]+\.)+[\w-]{2,4})?$/);
      var emailValue = $("."+ele).val();
      if(pattern.test($.trim(emailValue)) == false){
        $("."+ele).addClass('error');
        MessageService.flush("Invalid Email", 'danger');
        valid = false;

      }
    };

    self.removeError = function (element){
      $("."+element).removeClass('error');
    };


    self.neEmailValidation = function(ele){
      if($("."+ele).val() == ''){
        $("."+ele).addClass('error');
      }
    };

    self.refCodeShare = function () {
      $cordovaSocialSharing
        .share("Join me on Foodeebuddee using my Referral code - " + self.user.referralCode +" - ", null, null, self.baseUrl)
        .then(function(result) {
          //MessageService.flush('You shared your referral code successfully', 'success');
        }, function(err) {
          MessageService.flush('Something went wrong with the sharing. Please try again later!', 'warning');
        });
    };

    self.createEateryAction = function () {
      if (self.logged == true) {
        if(NavigatorService.isPrevent()){
            self.prevent('/eatery/new');
        }
        else{
            $location.path('/eatery/new');
        }
      }
      else {
        $location.path('/login');
        MessageService.flush('Please SIGN IN to create an Eatery!', 'warning', null, null);
      }
    };

    self.checkinAction = function () {
      if (self.logged == true) {
        if(NavigatorService.isPrevent()){
            self.prevent('/socials/checkin');
        }
        else{
            $location.path('/socials/checkin');
        }
      }
      else {
        $location.path('/login');
        MessageService.flush('Please SIGN IN to Check-In!', 'warning', null, null);
      }
    };

    self.forgetPassword = function() {
      NavigatorService.setOverwrite('/login');
      NavigatorService.setCurrent('/forgotPassword');
      $location.path('/forgotPassword');
    };

    self.changePasswordAction = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/changePassword');
      }
      else{
        $location.path('/changePassword');
      }
    };

    self.profileAction = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/profile');
      }
      else{
        $location.path('/profile');
      }
    };

    self.settingsAction = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/settings');
      }
      else{
        $location.path('/settings');
      }
    };

    self.refAction = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/refcode');
      }
      else{
        $location.path('/refcode');
      }
    };

    self.aboutUsAction = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/aboutus');
      }
      else{
        $location.path('/aboutus');
      }
    };

    self.tandcAction = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/tandc');
      }
      else{
        $location.path('/tandc');
      }
    };

    self.eateriesAction = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/eateries');
      }
      else{
        $location.path('/eateries');
      }
    };

    self.vouchersAction = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/vouchers/home');
      }
      else{
        $location.path('/vouchers/home');
      }
    };

    self.home = function () {
      if(NavigatorService.isPrevent()){
        self.prevent('/');
      }
      else{
        $location.path('/');
      }
    };

    self.prevent = function(location){
      var message  = 'Are you sure you want to cancel?';
      var buttonArray  = ['YES', 'NO'];
      $cordovaDialogs.confirm(message, buttonArray)
        .then(function(buttonIndex) {
          if(buttonIndex == 1){
            NavigatorService.setPrevent(false);
            $location.path(location);
          }
        });
    };
  });
