angular.module('FoodeeBuddee.resources.RecipesList',[])
    .factory('RecipesListResource', function($resource, SettingsService) {
        var recipeListResource = function(filter) {
            return $resource(SettingsService.rest_url + '/api/v1/list/recipes/' + filter);
        };
        return recipeListResource;
    });