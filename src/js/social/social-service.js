angular.module('FoodeeBuddee.services.Social', [])
  .service('SocialService', function($resource, SettingsService) {

    var postsResource = function() {
      return $resource(SettingsService.rest_url + '/api/v1/socials');
    };

    return postsResource;


  });