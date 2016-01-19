angular.module('FoodeeBuddee.resources.Blogs',['ngResource'])
    .factory('BlogsResource', ['$resource', 'serverUrl', 'SettingsService',function($resource, serverUrl,SettingsService) {
        //return $resource(serverUrl + '/api/v1/blogs/:id');
        return $resource(SettingsService.rest_url + '/api/v1/blog/:id');
    }]);
