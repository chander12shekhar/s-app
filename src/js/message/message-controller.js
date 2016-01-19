angular.module('FoodeeBuddee.controllers.Message', [])

.controller('MessageController', function(MessageService, $timeout, SubscriberService){
  var self = this;

  self.show = false;

  var messageTimeout = 3000; // 3 seconds

  self.message = '';
  self.type = '';

  SubscriberService.subscribe('message', function() {
    self.message = MessageService.getMessage();
    self.type = MessageService.getType();
    self.show = true;
    cb = MessageService.getCb();
    if(!MessageService.getLocked()) {
      $timeout(function() {
        self.show = false;
        if(cb != null) {
          cb();
        }
      }, messageTimeout);
    }
  });

  SubscriberService.subscribe('messageClean', function() {
    self.show = false;
  });


})

.factory('MessageService', function(SubscriberService) {

  var self = this;

  self.message = '';
  self.type = '';
  self.locked = false;
  self.cb = null;

  self.setMessage = function(message, type, locked, cb) {
    self.message = message;
    self.type = type;
    self.locked = locked === undefined ? false : locked;
    self.cb = cb === undefined ? null : cb;
    SubscriberService.publish('message');
  };

  self.clear = function() {
    SubscriberService.publish('messageClean');
  };

  self.getMessage = function() {
    return self.message;
  };

  self.getCb = function() {
    return self.cb;
  };

  self.getType = function() {
    return self.type;
  };

  self.getLocked = function() {
    return self.locked;
  };

  return {
    flush: self.setMessage,
    getMessage: self.getMessage,
    getType: self.getType,
    clear: self.clear,
    getLocked: self.getLocked,
    getCb: self.getCb
  };

});