angular.module('FoodeeBuddee.controllers.EateriesList', [])
  .controller('EateriesListController',
  function ($scope, ResourcesList, EateriesListResource, $routeParams, UserService, NavigatorService, SharedState, SearchService,
            SubscriberService, $location, LocationService, MessageService) {
    var self = this;
    NavigatorService.setCurrent('/eateries/list/' + $routeParams.filter);
    NavigatorService.setPrevious('/eateries');
    SharedState.initialize($scope, 'activeTab');
    SharedState.set('activeTab', 1);

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.filter = $routeParams.filter;
    self.selectedTab = self.filter;

    self.lat = 0.0;
    self.lng = 0.0;

    self.eateriesList = {};

    angular.element(document).ready(function () {
      $('.scrollable-header').each(function() {
        var self = this;
        var active = $('li.ng-scope.active');
        active = $(active[0]);
        $(self).animate({scrollLeft: active.offset().left}, 800, 'swing');
      });
    });

    if(self.filter == 'recommended' || self.filter == 'all') {
      getEateries(false);
    } else {
      self.eateriesList = new ResourcesList(new EateriesListResource(self.filter,self.lat,self.lng));
    }
    self.loggedIn = UserService.isLogged();

    self.favPage = 0;
    self.myPage = 0;
    self.recommendedPage = 0;

    self.eateryListrecommended = new Array();
    self.eateryListfavourite = new Array();
    self.eateryListmy = new Array();

    var mapping = [];
    mapping['all'] = { tab: 1, scroll: true };
    mapping['favourites'] = { tab: 2, scroll: true };
    mapping['recommended'] = { tab: 3, scroll: true };
    mapping['my'] = { tab: 4, scroll: true };

    if(self.filter !== undefined) {
      SharedState.set('activeTab', mapping[self.filter].tab);
      $scope.activeTab = mapping[self.filter].tab;
    }

    self.tabMenuSelected = function (filter) {
      var currentFilter = SharedState.get('activeTab');
      if(currentFilter != mapping[filter].tab) {
        NavigatorService.setCurrent('/eateries/list/' + filter);
        NavigatorService.setPrevious('/eateries/');
        SharedState.set('activeTab', mapping[filter]);
        self.filter = filter;
        self.selectedTab = filter;
        if(self.filter == 'recommended' || self.filter == 'all') {
          getEateries(true);
        } else {
          self.eateriesList = new ResourcesList(new EateriesListResource(self.filter,self.lat,self.lng));
        }
      }
    };

    self.viewEatery =  function(filter,id){
      NavigatorService.setOverwrite('/eateries/list/' + filter);
      NavigatorService.setCurrent('/eateries/'+id);
      $location.path('/eateries/'+id);
    };

    self.createEatery = function(filter) {
      NavigatorService.setOverwrite('/eateries/list/' + filter);
      $location.path('/eatery/new');
    };

    function getEateries(initPage) {
      LocationService.currentLocation()
        .then(function (position) {
          self.lat = position.coords.latitude;
          self.lng  = position.coords.longitude;
          self.eateriesList = new ResourcesList(new EateriesListResource(self.filter,self.lat,self.lng));
          if(initPage) {
            self.eateriesList.nextPage();
          }
        }, function(error) {
          if(self.filter == 'recommended') {
            MessageService.flush('Please enable Location services for better recommendations!', 'danger');
          }
          else if(self.filter == 'all') {
            MessageService.flush('Please enable Location services to view nearby Eateries!', 'danger');
          }
          self.eateriesList = new ResourcesList(new EateriesListResource(self.filter,self.lat,self.lng));
          if(initPage) {
            self.eateriesList.nextPage();
          }
        });
    };
  }
);