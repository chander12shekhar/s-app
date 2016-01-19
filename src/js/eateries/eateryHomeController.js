angular.module('FoodeeBuddee.controllers.EateryHomeController', [])
  .controller('EateryHomeController',
    function($scope, UserService, $http, SettingsService, NavigatorService, $location, MessageService, SearchService, SubscriberService) {
      var self = this;

      NavigatorService.setPrevious('/');

      SearchService.hide = true;
      SubscriberService.publish('searchBar');

      self.myEateriesCount = 0;

      $http.get(SettingsService.rest_url + '/api/v1/eateries/my/size')
          .success(function(data) {
            self.myEateriesCount = data;
          })
          .error(function(data) {
            self.myEateriesCount = 0;
          });

      $scope.secondaryNavModel = {
        title: 'Eateries',
        leftBtn: {
          title: 'FILTER',
          icon: 'fa-filter',
          link: ''
        },
        rightBtn: {
          title: 'Create',
          icon: 'fa-pencil-square-o',
          link: '#/eatery/new'
        }
      };
      $scope.footerModel = [{
        name: 'Rank',
        url: '#',
        iconClass: 'fa-pencil'
      }, {
        name: 'Badge',
        url: '#',
        iconClass: 'fa-thumbs-o-up'
      }];
      $scope.rankCount = 128;
      $scope.badgeValue = "Novice";

      $scope.loggedIn = UserService.isLogged();

      self.isLogged = function() {
          return UserService.isLogged();
      };

      self.createEatery = function() {
        if($scope.loggedIn) {
          $location.path('/eatery/new');
        }
        else {
          $location.path('/login');
          MessageService.flush('Please SIGN IN to create an Eatery!', 'failure');
        }
      };

      self.notLogged = function() {
        MessageService.flush('Please SIGN IN to view!', 'warning');
      };
    }
  );