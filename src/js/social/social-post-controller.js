angular.module('FoodeeBuddee.controllers.SocialPost', [])
  .controller('SocialPostController', function (StorageService, deviceReady, SocialPostService, MessageService, $location,
                                                $cordovaImagePicker, CameraService, $base64, NavigatorService, SearchService, SubscriberService) {
    var self = this;

    self.logged = StorageService.getBoolean('logged');
    if(!self.logged){
        $location.path('/login');
        MessageService.flush('Please SIGN IN for further actions !', 'warning', null, null);
    }
    NavigatorService.setCurrent('socials/post');
    NavigatorService.setPrevious('/social');

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.user = StorageService.getItem('user');
    self.item = {'status' : ''};
    self.busy = false;
    self.hasImage = false;

    self.eateryList = [];
    self.checkinResults = 0;
    self.checkInfo = {};


    self.post = function () {
      if(self.item.status.trim() == '' && self.hasImage == false) {
        MessageService.flush('Your post cannot be empty!', 'warning');
      } else {
        self.busy = true;
        SocialPostService.post(self.item)
          .success(function (data, status) {
            $location.path('/social');
            self.busy = false;
            MessageService.flush('Your post was perfect!', 'success');
          })
          .error(function (data, status) {
            // TODO: error handling
            MessageService.flush('Something went wrong. Please try again later!', 'danger');
            self.busy = false;
          });
      }
    };

    self.selectPicture = function () {
      deviceReady(function () {
          $cordovaImagePicker.getPictures({
              maximumImagesCount: 1,
              quality: 60,
              width: 800,
              height: 800
            })
            .then(function (result) {

              window.resolveLocalFileSystemURL(result[0], function(fileEntry) {
                var reader = new FileReader();
                var loadImage = function(file) {
                  reader.onload = function(readerEvt) {
                    var binaryString = readerEvt.target.result;
                    self.item.image = $base64.encode(binaryString);
                    var smallImage = document.getElementById('main-image');
                    smallImage.style.display = 'block';
                    self.hasImage = true;
                    smallImage.src = "data:image/jpeg;base64," + self.item.image;
                  };
                  reader.readAsBinaryString(file);
                };

                fileEntry.file(loadImage, function(err) { console.log(err); });

              }, function(err) {console.log(err); });


            }, function (error) {
              alert(error);
            });
        }
      );
    };

    self.removeImage = function() {
      self.item.image = null;
      self.hasImage = false;
      var smallImage = document.getElementById('main-image');
      smallImage.style.display = 'none';
    };

    self.selectEatery = function(eatery) {
      self.checkInfo.eatery = eatery;
    };

    self.checkinPage = function() {
      $location.path('/socials/checkin');
    };

    self.takePicture = function () {
      CameraService.capture(function (imageData) {
        var smallImage = document.getElementById('main-image');
        smallImage.style.display = 'block';
        smallImage.src = "data:image/jpeg;base64," + imageData;
        self.item.image = imageData;
        self.hasImage = true;
      });
    };

    self.cancel = function() {
      $location.path('/social');
    }
  });