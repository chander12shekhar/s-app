angular.module('FoodeeBuddee.resources.Eateries',['ngResource'])
    .factory('EateriesResource', ['$resource', 'serverUrl','SettingsService', function($resource, serverUrl,SettingsService) {
        return $resource(SettingsService.rest_url  + '/api/v1/eateries/:id');
    }]);
