angular.module('FoodeeBuddee.service.SocialPost', [])
  .service('SocialPostService', function (SettingsService, $http) {

    var self = this;

    self.eatery = {};

    self.post = function(item) {
      var req = {
        method: 'POST',
        data: item,
        url: SettingsService.rest_url + '/api/v1/social/post'
      };
      return $http(req);
    };

    self.like = function(id) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/social/like/' + id
      };
      return $http(req);
    };

    self.comment = function(id, comments) {
      var data = { commentContent: comments };
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/social/postComment/' + id,
        data: data
      };
      return $http(req);
    };

    self.likeComment = function(id) {
      var req = {
        method: 'GET',
        url: SettingsService.rest_url + '/api/v1/social/comment/like/' + id
      };
      return $http(req);
    };

    self.updateComment = function(id, comment) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/social/comment/update/' + id,
        data: { commentContent: comment }
      };
      return $http(req);
    };

    self.deleteComment = function(id, item) {
      var req = {
        method: 'DELETE',
        url: SettingsService.rest_url + '/api/v1/social/comment/delete/' + id,
        data: { postId: item.id }
      };
      return $http(req);
    };

    self.getCheckinSuggestions = function(coords) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/social/checkin/suggestions',
        data: { latitude: coords.latitude, longitude: coords.longitude }
      };
      return $http(req);
    };

    self.checkin = function(checkInfo) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/social/checkin/check',
        data: {id:checkInfo.eatery.id, status:checkInfo.status}
      };
      return $http(req);
    };



    self.updatePost = function(id, comment) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/social/updatePost/' + id,
        data: { commentContent: comment }
      };
      return $http(req);
    };

    self.deletePost = function(id) {
      var req = {
        method: 'DELETE',
        url: SettingsService.rest_url + '/api/v1/social/deletePost/' + id,
      };
      return $http(req);
    };

    return self;
  });

