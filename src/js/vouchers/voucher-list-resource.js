angular.module('FoodeeBuddee.resources.VouchersList', [])
  .factory('VoucherListResource', function ($resource, serverUrl, SettingsService) {
    var voucherListResource = function (filter, city) {
      var cityFilter = '';
      if(city !== null && city.id !== null) {
        cityFilter = '/' + city.id;
      }
      return $resource(SettingsService.rest_url + '/api/v1/vouchers/list/' + filter + cityFilter);
    };
    return voucherListResource;
  });
