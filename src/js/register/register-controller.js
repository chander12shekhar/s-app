angular.module('FoodeeBuddee.controllers.Register', [])

  .controller('RegisterController',
  function(UserService, $location, AuthorizationService, StorageService, MessageService, RegisterService, SubscriberService,
           LocationService, SearchService, NavigatorService, EateryHelperService){
    var self = this;

    self.user = StorageService.getItem('user');
    if(self.user != undefined){
        if(self.user.favoriteCuisines === null || self.user.favoriteCuisines === undefined){
            self.user.favoriteCuisines = [];
        }
        if(self.user.mealOptions === null || self.user.mealOptions === undefined){
            self.user.mealOptions = [];
        }
        if(self.user.favouriteDish === null || self.user.favouriteDish === undefined){
            self.user.favouriteDish = [];
        }
        if(self.user.eatingOutOptions === null || self.user.eatingOutOptions === undefined){
            self.user.eatingOutOptions = [];
        }
        NavigatorService.setPrevious('/login');
    }

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.logged = function() {
      return StorageService.getBoolean('logged');
    };

    self.dateOfBirth = '';
    self.birthday = {};
    if(self.user != null && self.user.dateOfBirth != null){
      self.dob = self.user.dateOfBirth.split("/");
      self.birthday.dd=self.dob[0];
      self.birthday.mm=self.dob[1];
      self.birthday.yyyy=self.dob[2];
    }

    self.gender = '';

    var IM_USED = '226';
    var OK = '200';

    self.test = function() {

    };
    var validCheck = true;

    self.register = function() {
      var valid = true;
      if(self.user.firstName != '' ){self.firstCharacterValidation('Fname');}
      if(self.user.lastName != ''){self.firstCharacterValidation('LName'); }
      if(self.user.email != ''){self.checkEmailFormat('REmail');}
      if(self.user.password != ''){self.checkPasswordLength('FPassword');}
      if(self.user.password != self.transient.password){
        MessageService.flush("Passwords do not match!", 'danger');
        $(".RPassword").addClass('error');
        validCheck =  false;
      }
      if(validCheck == false){
        valid = false;
        validCheck = true;
      }
      if(valid){
        self.fillCurrentLocDetails();
        setTimeout(function(){
          self.user.currentLocationCountry = LocationService.countryVal.trim();
          self.user.currentLocationState = LocationService.stateVal.trim();
          self.user.currentCity = LocationService.cityVal.trim();
        }, 1000);

        var success = function(data, status) {
          if (status == OK) {
            StorageService.setItem('user', data);
            StorageService.setItem('logged', true);
            SubscriberService.publish('login');
            $location.path('/add-spice');
          } else if(status == IM_USED) {
            MessageService.flush('User with email ' + self.user.email + ' already exists', 'danger');
          }
        };

        var error = function(error) {
          MessageService.flush('An error occurred! Please try again', 'danger');
        };

        setTimeout(function() {
          UserService.register(self.user)
            .success(success)
            .error(error);
        } ,1000);
      }
    }

    self.firstCharacterValidation = function(ele){
      var pattern = new RegExp(/^[A-Za-z][A-Za-z0-9\d\s]*$/);
      var pattern1 = new RegExp(/^[A-Za-z0-9\d\s]*$/);
      var firstNameValue = $("."+ele).val();
      if(pattern.test($.trim(firstNameValue)) == false){
        $("."+ele).addClass('error');
        MessageService.flush("Invalid Name!", 'danger');
        validCheck =  false;
      }
      if(pattern1.test($.trim(firstNameValue)) == false){
        $("."+ele).addClass('error');
        MessageService.flush("Invalid Name!", 'danger');
        validCheck =  false;
      }
    };
    self.checkEmailFormat = function(ele){
      var pattern = new RegExp(/^([A-Za-z0-9._]+@([\w-]+\.)+[\w-]{2,4})?$/);
      var emailValue = $("."+ele).val();
      if(pattern.test($.trim(emailValue)) == false){

        $("."+ele).addClass('error');
        MessageService.flush("Invalid email!", 'danger');
        validCheck =  false;
      }
    };
    self.checkPasswordLength = function(ele){
      if( $("."+ele).val().length < 8 || $("."+ele).val().length > 50 ){
        $("."+ele).addClass('error');
        MessageService.flush("Your Password should contain a minimum of 8 characters!", 'danger');
        validCheck =  false;
      }
      var pattern = new RegExp(/^[A-Za-z0-9.,&-:*$#@!^?%_]+$/);
      var passwordValue = $("."+ele).val();
      if(pattern.test($.trim(passwordValue)) == false){
        $("."+ele).addClass('error');
        MessageService.flush("Your Password cannot contain white spaces!", 'danger');
        validCheck =  false;
      }
    };

    self.newAccountValidation = function(ele){
      if($("."+ele).val() == ''){
        $("."+ele).addClass('error');
      }
    };

    self.removeError = function (element){
      $("."+element).removeClass('error');
    };

    self.removeErrorGender = function(element){
      $("."+element).removeClass('error');
    }


    var validCheck = true;
    self.addSpice = function() {
      var valid = true;
      if(self.user.firstName == '') { self.checkValidate('Fname');}
      if(self.user.lastName == '') { self.checkValidate('Lname');}
      if(self.user.countryOfOrigin == '' || self.user.countryOfOrigin === undefined) { self.checkValidate('Corigin');}
      if(self.user.stateOfOrigin == '' || self.user.stateOfOrigin === undefined) { self.checkValidate('Sorigin');}
      if(self.user.cityOfOrigin == '' || self.user.cityOfOrigin === undefined) { self.checkValidate('Coorigin');}
      if(self.user.currentLocationCountry == '' || self.user.currentLocationCountry === undefined) { self.checkValidate('country');}
      if(self.user.currentLocationState == '' || self.user.currentLocationState === undefined) { self.checkValidate('location');}
      if(self.user.currentCity == '' || self.user.currentCity === undefined) { self.checkValidate('city');}
      if(self.user.gender == '' || self.user.gender === null ){
        self.checkValidate('gender-check');
      }
      if(self.dateOfBirth == '' || self.dateOfBirth === null ){
        self.checkValidate('dob');
        valid = false;
      }
      else if(!self.validateDOB()) {
        MessageService.flush('Are you above 18?', 'warning');
        valid = false;
      }
      if(validCheck == false){
        MessageService.flush('Please fill all the mandatory fields!', 'warning');
        valid = false;
      }
      else if(self.refCode != ''){
        if(!self.validRefCode){
            valid = false
            MessageService.flush('Oops! Invalid Referral code!', 'warning');
        }
      }
      if(valid){
        var city = $(".city").val();
        var state = $(".location").val();
        var country = $(".country").val();
        var geocoder = new google.maps.Geocoder();
        var address = city+','+state+','+country;
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            self.user.lat = results[0].geometry.location.lat();
            self.user.lng = results[0].geometry.location.lng();
            self.user.dateOfBirth = self.dateOfBirth.getDate()+'/'+(self.dateOfBirth.getMonth() + 1)+'/'+self.dateOfBirth.getFullYear();
            if(self.user.mainImage == '') self.user.mainImage = null;
            if(self.user.referralCode == '') self.user.referralCode = null;
            self.user.refferedCode = self.refCode;
            RegisterService.addSpice(self.user)
              .success(function(data) {
                StorageService.setItem('user', data);
                StorageService.setItem('logged', true);
                UserService.generateShortUrl(data);
                MessageService.flush('Your account was successfully created!', 'success');
                $location.path('/registration-success');
                SubscriberService.publish('login');
              })
              .error(function(error) {
                MessageService.flush('Oops! Something went wrong. Please try again later!', 'danger');
              });
          }
        });
      }
      else{
        validCheck = true;
      }
    };

    self.checkValidate = function(ele){
      $("."+ele).addClass('error');
      validCheck = false;
    };

    self.validateDOB = function () {
      var birth = self.dateOfBirth;
      var fdate = (birth.getMonth() + 1)+'/'+birth.getDate()+'/'+birth.getFullYear();
      var date1 = new Date(fdate); //birthday
      var date2 = new Date();
      var age = 18;
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays > (age * 365.242199) ;
    };

    self.fillCurrentLocDetails = function() {
      LocationService.currentLocation()
        .then(function (position) {
          self.lat = position.coords.latitude;
          self.lng  = position.coords.longitude;
          LocationService.getLocationDetails(position.coords.latitude, position.coords.longitude);
        }, function(error) {
          MessageService.flush('Please enable Location services to fetch your Current Location details!', 'danger');
        });
    };

    self.successSkip = function() {
        $location.path('/');
    };

    self.mealUpdate = function() {
        RegisterService.updateMalInfo(self.user)
          .success(function(data) {
            StorageService.setItem('user', data);
            StorageService.setItem('logged', true);
            MessageService.flush('Profile updated Successfully!', 'success');
            $location.path('/');
            SubscriberService.publish('login');
          })
          .error(function(error) {
            MessageService.flush('Oops! Something went wrong. Please try again later!', 'danger');
          });
    };

    if($("#meal-info").val() != undefined){
        self.cuisineTypes = [];
        self.cuisineLabels = {buttonDefaultText: 'Please select your favourite Cuisines!'};
        EateryHelperService.getCuisineTypes()
          .success(function (data) {
            self.cuisineTypes = data;
          })
          .error(function (data) {
          });

        self.mealOptions = [];
        self.mealOptionLabels = {buttonDefaultText: 'Please select your Meal Preference!'};
        EateryHelperService.getMealOptions()
          .success(function (data) {
            self.mealOptions = data;
          })
          .error(function (data) {
          });
        self.multiSelectCuisineSettings = EateryHelperService.multiSelectCuisineSettings;
    }

    self.refCode = '';
    self.validRefCode = false;
    self.verifyReferralCode = function(){
        if(self.refCode.length == 8){
            RegisterService.verifyReferralCode(self.refCode)
            .success(function(data) {
                if(data.message == 'success'){
                    self.validRefCode = true;
                    MessageService.flush('Hola! Referral code matched!', 'success');
                }
                else{
                    self.validRefCode = false;
                    MessageService.flush('Oops! Invalid Referral code!', 'warning');
                }
            })
            .error(function(error) {
                MessageService.flush('Oops! Something went wrong. Please try again later!', 'danger');
            });
        }
    };
  });