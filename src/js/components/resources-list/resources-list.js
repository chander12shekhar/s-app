angular.module('FoodeeBuddee.services.ResourcesList', [])
  .factory('ResourcesList', function () {
    var self;

    var ResourcesList = function (resource) {
      self = this;
      self.items = [];
      self.busy = false;
      self.page = 1;
      self.endReached = false;
      self.resource = resource;
    };

    ResourcesList.prototype.setCallback = function(cb) {
      self.cb = cb;
    };

    ResourcesList.prototype.nextPage = function () {

      if (self.busy || self.endReached) return;
      self.busy = true;
      self.resource.query({page: self.page}).$promise.then(function (items) {
        items.forEach(function (item) {
          self.items.push(item);
        });

        if (items.length > 0) {
          self.page += 1;
        } else {
          self.endReached = true;
        }
      }, function () {
        self.endReached = true;
      }).finally(function () {
        self.busy = false;
        if(self.cb !== undefined) {
          self.cb(self.items);
        }
      });
    };

    return ResourcesList;
  });
