angular.module('FoodeeBuddee.services.LeaderBoard', [])
  .service('LeaderBoardService', function($http, SettingsService, $interval, $cacheFactory, $filter) {
    var self = this;

    self.getLeaderBoard = function(type) {
//      return $http.get(SettingsService.rest_url + '/api/v1/leaderboard/me');
      return $http({
        url: SettingsService.rest_url + '/api/v1/leaderboard/'+type,
        method: 'GET',
        cache: true
      });
    };

    self.fetchBadges = function(type) {
      return $http({
        url: SettingsService.rest_url + '/api/v1/leaderboard/badges/'+type,
        method: 'GET'
      });
    };

    //clearing the cache every 5 minutes
    $interval(function () {
      //var time = $filter('date')(new Date(), 'HH:mm:ss');
      self.clearCache();
    }, 300000);

    self.clearCache = function(){
      var $httpDefaultCache = $cacheFactory.get('$http');
      $httpDefaultCache.removeAll();
    };

    return self;
  });