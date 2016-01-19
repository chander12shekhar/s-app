angular.module('FoodeeBuddee.controllers.Settings', [])
  .controller('SettingsController', function (SettingsService, $http, MessageService, StorageService, $location, SearchService,
        SubscriberService, ProfileSettingsService,SharedState,$scope,deviceReady,$cordovaImagePicker,$base64,NavigatorService) {
    var self = this;

    SearchService.hide = true;
    SubscriberService.publish('searchBar');
    SharedState.initialize($scope, 'activeTab');
    SharedState.set('activeTab', 1);
    self.data = {};

    var user = StorageService.getItem('user');
    self.user = user;
    if(self.user.dateOfBirth != null ){
        var dob = self.user.dateOfBirth.split("/");
        self.dateOfBirth = new Date(dob[1]+'/'+dob[0]+'/'+dob[2]);
    }
    self.passwordChangable = user.socialProvider === 'FOODEEBUDDEE';

    var validCheck = true;
    self.reset = function () {
    var valid = true;
    if(self.data.password != ''){ self.checkPasswordLength('FPassword');}
      if (self.data.new_password != self.data.new_password_repeat) {
        MessageService.flush('New passwords don\'t match', 'warning');
      }
      else if (self.data.password == self.data.new_password) {
        MessageService.flush('Old and New passwords are same', 'warning');
      } else {
      if(validCheck == false){
          valid = false;
          validCheck = true;
      }
        if(valid){
            var req = {
              method: 'POST',
              url: SettingsService.rest_url + '/api/v1/settings/reset',
              data: {oldPassword: self.data.password, newPassword: self.data.new_password}
            };
        }
        $http(req)
          .success(function (data) {
            MessageService.flush(data.message, 'success');
            if(data.messageType == 'success') {
              $location.path('/');
            }
          })
          .error(function (data) {
            MessageService.flush('Something went wrong. Please try again later!', 'danger');
          });
      }
    };

    self.checkPasswordLength = function(ele){
        if( $("."+ele).val().length < 8 || $("."+ele).val().length > 50 ){
            $("."+ele).addClass('error');
            MessageService.flush("Password Should Be Minimum 8 Characters", 'danger');
            validCheck = false;
        }
        var pattern = new RegExp(/^[A-Za-z0-9.,&-:*$#@!^?%_]+$/);
        var passwordValue = $("."+ele).val();
        if(pattern.test($.trim(passwordValue)) == false){
            $("."+ele).addClass('error');
            MessageService.flush("Password Not Allow Space Character", 'danger');
        }
    };
    self.removeError = function (element){
      $("."+element).removeClass('error');
    };

    self.toggleType = function (ele) {
        ele = !ele;
    };

    self.savePrivacySettings = function () {
        ProfileSettingsService.savePrivacySettings(self.user)
            .success(function (data) {
                StorageService.setItem('user', data);
                MessageService.flush('Saved successfully !!');
            })
            .error(function () {
                MessageService.flush('Something went wrong. Please try again later!', 'danger');
            });
    };


    var validCheck = true;
    self.saveUserProfile = function () {
      var valid = true;
      validCheck = true;
      if(self.user.firstName == '') { self.checkValidate('Fname');}
      if(self.user.lastName == '') { self.checkValidate('Lname');}
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
      if(valid){
          self.user.dateOfBirth = self.dateOfBirth.getDate()+'/'+(self.dateOfBirth.getMonth() + 1)+'/'+self.dateOfBirth.getFullYear();
          ProfileSettingsService.saveUserProfile(self.user)
          .success(function (data) {
              StorageService.setItem('user', data);
              MessageService.flush('Saved successfully !!');
          })
          .error(function () {
              MessageService.flush('Something went wrong. Please try again later!', 'danger');
          });
      }

    };

    self.saveUserAddress = function () {
        var valid = true;
        validCheck = true;
        if(self.user.currentLocationCountry == '') { self.checkValidate('current-country');}
        if(self.user.currentLocationState == '') { self.checkValidate('current-state');}
        if(self.user.currentCity == '') { self.checkValidate('current-city');}

        if(validCheck == false){
            MessageService.flush('Please fill all the mandatory fields!', 'warning');
            valid = false;
        }
        if(valid){
            ProfileSettingsService.saveUserAddress(self.user)
            .success(function (data) {
                StorageService.setItem('user', data);
                MessageService.flush('Saved successfully !!');
            })
            .error(function () {
                MessageService.flush('Something went wrong. Please try again later!', 'danger');
            });
        }
    };

    self.saveUserOrigin = function () {
        var valid = true;
        validCheck = true;
        if(self.user.countryOfOrigin == '') { self.checkValidate('origin-country');}
        if(self.user.stateOfOrigin == '') { self.checkValidate('origin-state');}
        if(self.user.cityOfOrigin == '') { self.checkValidate('origin-city');}

        if(validCheck == false){
            MessageService.flush('Please fill all the mandatory fields!', 'warning');
            valid = false;
        }
        if(valid){
            ProfileSettingsService.saveUserOrigin(self.user)
            .success(function (data) {
                StorageService.setItem('user', data);
                MessageService.flush('Saved successfully !!');
            })
            .error(function () {
                MessageService.flush('Something went wrong. Please try again later!', 'danger');
            });
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

    self.removeError = function (element){
      $("."+element).removeClass('error');
    };

    //Todo rectify this function
    self.selectPicture = function (imagePreviewId) {
        deviceReady(function () {
            $cordovaImagePicker.getPictures({
                maximumImagesCount: 1,
                quality: 60,
                width: 800,
                height: 800
              })
              .then(function (result) {
                window.resolveLocalFileSystemURL(result[0], function (fileEntry) {
                  var reader = new FileReader();
                  var loadImage = function (file) {
                    reader.onload = function (readerEvt) {
                      var binaryString = readerEvt.target.result;
                      var imageData = $base64.encode(binaryString);
                      var smallImage = document.getElementById(imagePreviewId);
                      smallImage.style.display = 'block';
                      smallImage.src = "data:image/jpeg;base64," + imageData;
                      self.user.newImage = imageData;
                    };
                    reader.readAsBinaryString(file);
                  };

                  fileEntry.file(loadImage, function (err) {
                    console.log(err);
                  });

                }, function (err) {
                  console.log(err);
                });


              }, function (error) {
                alert("Sorry, we could not load your picture");
              });
          }
        );
      };

      self.editProfilePage = function(){
        NavigatorService.setCurrent('/editProfile');
        NavigatorService.setPrevious('/settings');
        $location.path('/editProfile');
      };

      self.changePasswordPage = function(){
        NavigatorService.setCurrent('/changePassword');
        NavigatorService.setPrevious('/settings');
        $location.path('/changePassword');
      };

      self.privacyPage = function(){
        NavigatorService.setCurrent('/privacy');
        NavigatorService.setPrevious('/settings');
        $location.path('/privacy');
      };

      self.mealPreferencePage = function(){
        NavigatorService.setCurrent('/meal-preference');
        NavigatorService.setOverwrite('/settings');
        $location.path('/meal-preference');
      };
  });