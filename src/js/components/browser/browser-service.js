angular.module('FoodeeBuddee.services.Browse', [])
  .service('NavigatorService', function ($location,$cordovaDialogs) {
    var self = this;

    var previous = null;
    var current = null;
    var overwrite = null;
    var prevent = false;

    self.setCurrent = function(location) {
      if(current !== null) {
        previous = current;
      }
      current = location;
    };

    self.hasPrevious = function() {
      return previous !== null;
    };

    self.setPrevious = function(location) {
      previous = location;
    };

    self.setPrevent = function(bool) {
      prevent = bool;
    };

    self.isPrevent = function() {
      return prevent;
    };

    /**
     * To overwrite the back behavior of the button when
     * moving to a different scope
     * @param location
     */
    self.setOverwrite = function(location) {
      overwrite = location;
    };

    self.goBack = function() {
      if(prevent){
          var message  = 'Are you sure you want to cancel?';
          var buttonArray  = ['YES', 'NO'];
          $cordovaDialogs.confirm(message, buttonArray)
          .then(function(buttonIndex) {
              if(buttonIndex == 1){
                self.navigate();
                prevent = false;
              }
          });
      }
      else{
        self.navigate()
      }
    };

    self.navigate = function(){
      if(overwrite !== null) {
        $location.path(overwrite);
        overwrite = null;
      }else if(previous !== null) {
        $location.path(previous);
        current = previous;
      }
    }

    return self;

  });