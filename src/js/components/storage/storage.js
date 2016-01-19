angular.module('FoodeeBuddee.services.Storage', [])

.factory('StorageService', function(){
  var self = this;
  self.storage = window.localStorage;

  return {
    setItem: function(key, object) {
      self.storage.setItem(key, angular.toJson(object, true));
    },

    getItem: function(key) {
      return angular.fromJson(self.storage.getItem(key));
    },

    removeItem: function(key) {
      self.storage.removeItem(key);
    },

    getBoolean: function(key) {
      var result = angular.fromJson(self.storage.getItem(key));
      return result === 'true' || result;
    }
  };

});