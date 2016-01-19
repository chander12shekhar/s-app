angular.module('FoodeeBuddee.controllers.Search', [])
  .controller('SearchController',
  function (SearchService, UserService, $rootScope, $scope, $http, SettingsService, $location, SubscriberService,LocationService) {
    var self = this;
    self.backbuttonenable = true;
    self.term = '';
    self.selected = '';

    self.lat=0;
    self.lng=0;
    LocationService.currentLocation().then(function(result) {
        LocationService.getLocationDetails(result.coords.latitude,result.coords.longitude);
        self.lat = result.coords.latitude;
        self.lng = result.coords.longitude;
    });

    self.toggleSearchBar = function () {
      SearchService.toggleSearchBar();
    };
    self.clearSearchBar = function () {
      if(self.selected.trim() === '') {
        SearchService.toggleSearchBar();
        SubscriberService.publish('searchBar');
      }
      else {
        self.selected = '';
      }
    };

    self.hide = function () {
      return SearchService.hide;
    };

    self.search = function (item) {
      SearchService.toggleSearchBar();
      SubscriberService.publish('searchBar');
      self.term = '';
      self.selected = '';
      $location.path(item.url)
    };

    self.results = function () {
      var searchParams ={locality:"",city:"",country:"",lat:0,lng:0,term:""};
      searchParams.locality =  LocationService.locality.trim();
      searchParams.city =  LocationService.cityVal.trim();
      searchParams.country =  LocationService.countryVal.trim();
      searchParams.lat = self.lat;
      searchParams.lng = self.lng;
      searchParams.term = self.selected;
      var req = {
          method: 'POST',
          url: SettingsService.rest_url + '/api/v1/auto-suggest/All',
          data:searchParams
       };
       return $http(req)
       .then(function (response) {
           return response.data;
       });
    };

    self.backHandler = function () {
      window.history.back();
    };

    self.loggedIn = UserService.isLogged();
  });