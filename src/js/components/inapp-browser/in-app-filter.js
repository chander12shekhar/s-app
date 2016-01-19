angular.module('FoodeeBuddee.services.InAppFilter', [])
  .service('InAppFilter', function ($location) {
    var self = this;

    self.initEateryFilter = function (selector) {
      $(selector).on('click', 'a', function (elem) {
        elem.preventDefault();
        var self = this;
        var link = $(self).attr('href');
        if (link.indexOf('/eatery/') != -1) {
          var eateryName = link.substr(link.lastIndexOf('/') + 1);
          var path = '/eateries/' + eateryName;
          $location.path(path);
        }
      });
    };

    return self;

  });