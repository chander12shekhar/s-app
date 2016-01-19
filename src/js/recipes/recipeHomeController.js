angular.module('FoodeeBuddee.controllers.RecipeHomeController', [])
  .controller('RecipeHomeController', ['$scope','UserService',
    function($scope, UserService) {
      var self = this;
      $scope.secondaryNavModel = {
        title: 'RECIPES',
        leftBtn: {
          title: 'FILTER',
          icon: 'fa-filter',
          link: ''
        },
        rightBtn: {
          title: 'Create',
          icon: 'fa-pencil-square-o',
          link: ''
        }
      };
      self.recipes ={};
      self.recipes.counts={
        all: 34,
        recommended: 25,
        myRecipes: 10
      };
      $scope.rankCount = 128;
      $scope.badgeValue = "Novice";
      $scope.loggedIn=UserService.isLogged();
      self.isLogged= function() {
        return UserService.isLogged();
      };
      $scope.backHandler = function() {
        window.history.back();      
      };
    }
  ]);