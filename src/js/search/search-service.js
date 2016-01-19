angular.module('FoodeeBuddee.services.Search', [])
  .service('SearchService', function($http, SettingsService) {
    var self = this;

    self.hide = true;

    self.toggleSearchBar = function() {
      self.hide = self.hide === false ? true: false;
    };

    self.request = function(term) {
      var req = {
        method: 'GET',
        url: SettingsService.rest_url + '/api/v1/auto-suggest/All?term=' + term
      };
      return $http(req);
    };

    return self;

  });