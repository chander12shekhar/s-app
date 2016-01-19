angular.module('FoodeeBuddee.resources.EateriesList',[])
  .factory('EateriesListResource', function($resource, serverUrl,SettingsService) {
    var eateryListResource = function(filter,lat,lng) {
        if(filter == 'recommended' || filter == 'all'){
            var url = '/'+lat+'/'+lng+'/'+filter;
            return $resource(SettingsService.rest_url + '/api/v1/eateries/list' + url);
        }
        else{
            return $resource(SettingsService.rest_url + '/api/v1/eateries/list/' + filter);
        }
    };
    return eateryListResource;
  });
