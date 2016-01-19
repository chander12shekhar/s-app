angular.module('FoodeeBuddee.resources.Recipes',['ngResource'])
    .factory('RecipesResource', ['$resource', 'serverUrl','SettingsService',function($resource, serverUrl,SettingsService) {

        var self=this;

        return $resource(SettingsService.rest_url + '/api/v1/recipes/:id');

    }]);
