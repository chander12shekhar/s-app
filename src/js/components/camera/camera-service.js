angular.module('FoodeeBuddee.services.Camera', [])
  .service('CameraService', function ($rootScope, MessageService, deviceReady) {

    var self = this;

    var pictureSource;
    var destinationType;
    var elementId;

    self.encodedImage;

    self.setElement = function (element) {
      elementId = element;
    };

    var onPhotoDataSuccess = function (imageData) {
      self.encodedImage = imageData;
    };

    self.capture = function (cb) {
      deviceReady(function () {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        navigator.camera.getPicture(cb, onFail, {
          quality: 50,
          destinationType: destinationType.DATA_URL,
          correctOrientation : true
        });
      });
    };

    self.multiCapture = function (callback) {
      deviceReady(function () {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        navigator.camera.getPicture(callback, onFail, {
          quality: 50,
          destinationType: destinationType.DATA_URL,
          correctOrientation : true
        });
      });
    };

    var onFail = function (message) {
      console.log('Failed because: ' + message);
    };

    return self;


  });