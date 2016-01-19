angular.module('FoodeeBuddee.eateries.common.helper', [])
  .service('EateryCommonService', function($http, SettingsService) {

    var self = this;
    self.timeout = 30000;
    self.base_url = "/api/v1/eateries";
    self.mode = 'development',
      self.developmentUrl = SettingsService.rest_url,
      self.localUrl = 'stubs',
      self.productionUrl = SettingsService.rest_url,

      self.urlConfiguration = {
        development: {
          getAdvanceRating: self.developmentUrl + self.base_url + '/getAdvanceRating',
          submitAdvanceRating: self.developmentUrl + self.base_url + '/submitAdvanceRating',
          likeEatery: self.developmentUrl + self.base_url + '/likeEatery',
          yummyEatery: self.developmentUrl + self.base_url + '/yummyEatery',
          getBasicRating: self.developmentUrl + self.base_url + '/getBasicRating',
          submitBasicRating: self.developmentUrl + self.base_url + '/submitBasicRating'
        },
        production: {
          getAdvanceRating: self.productionUrl + self.base_url + '/getAdvanceRating',
          submitAdvanceRating: self.productionUrl + self.base_url + '/submitAdvanceRating',
          likeEatery: self.productionUrl + self.base_url + '/likeEatery',
          yummyEatery: self.productionUrl + self.base_url + '/yummyEatery',
          getBasicRating: self.productionUrl + self.base_url + '/getBasicRating',
          submitBasicRating: self.productionUrl + self.base_url + '/submitBasicRating'
        }
      };
    self.getPacket = function(url, method, data) {

      var request = {};
      var realUrl = self.urlConfiguration[self.mode][url];

      //Need to Customize for get with parameters.
      if (method === 'GET') {
        if (url == 'getRating') {
          realUrl = realUrl.replace('param', data);
        } else {
          realUrl = realUrl.replace('{param}', data);
        }
        request = {
          url: realUrl,
          method: method,
          timeout: self.timeout,
          cache: true
        };

      } else if (method == 'POST' && (data != null)) {
        request = {
          method: 'POST',
          url: realUrl,
          data: data,
          timeout: self.timeout,
          cache: true
        };
      }
      return request;
    };
    self.getUrl = function(url) {
      var realUrl = self.urlConfiguration[mode][url];
      return realUrl;
    };

    self.getBasicRating = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getBasicRating', 'GET', data);
      return $http(request);
    };
    self.submitBasicRating = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('submitBasicRating', 'POST', data);
      return $http(request);
    };

    self.getAdvanceRating = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getAdvanceRating', 'GET', data);
      return $http(request);
    };
    self.submitAdvanceRating = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('submitAdvanceRating', 'POST', data);
      return $http(request);
    };

    self.addYummyEatery = function(data) {
      var request = self.getPacket('addYummyEatery', 'POST', data);
      return $http(request);
    };
    self.addlikeEatery = function(data) {
      var request = self.getPacket('likeEatery', 'POST', data);
      return $http(request);
    };

    return self;

  });