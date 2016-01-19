angular.module('FoodeeBuddee.resources.Reviews',['ngResource'])
    .factory('ReviewsResource', ['$resource', 'serverUrl','SettingsService', function($resource, serverUrl,SettingsService) {
        return $resource(SettingsService.rest_url  + '/api/v1/review/:id');
    }]);
