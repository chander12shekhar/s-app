/**
 * This controller needs major refactoring ... It is just awful!!!!!
 */
angular.module('FoodeeBuddee.controllers.RecipesList', [])
  .controller('RecipesListController', function($scope, ResourcesList, RecipesResource, ReceipeHelperService, SettingsService,UserService, RecipesListResource, SearchService, SubscriberService) {
    var self = this;

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.recipesList = null;
    self.selectedRecord = null;

    self.recipesList = new ResourcesList(new RecipesListResource('all'));

    self.loggedIn = UserService.isLogged();

    self.favPage = 0;
    self.myPage = 0;
    self.recommendedPage = 0;

    self.selectedTab = 'all';

    self.recipesubMenuSelected = function(filter) {
      self.recipesList = new ResourcesList(new RecipesListResource(filter));
      self.selectedTab = filter;
    };

    var data = {
      userid: "userid"
    };

    //Recipe Filter Features.
    self.mainMenu = [{
      name: 'Day',
      id: 0,
      value: 'day',
      subItems: [{
        name: '7 Day',
        id: 10,
        value: 0
      }, {
        name: '15 Day',
        id: 20,
        value: 0
      }, {
        name: 'January',
        id: 30,
        value: 0
      }, {
        name: 'February',
        id: 40,
        value: 0
      }]
    }, {
      name: 'Type of Cuisine',
      id: 1,
      value: 'cuisine',
      subItems: [{
        name: 'Indian',
        id: 10,
        value: 0
      }, {
        name: 'Chinese',
        id: 20,
        value: 0
      }, {
        name: 'American',
        id: 30,
        value: 0
      }, {
        name: 'Arabian',
        id: 40,
        value: 0
      }]
    }, {
      name: 'Type of Sub Cuisine',
      id: 2,
      value: 'subCuisine',
      subItems: [{
        name: 'South Indian',
        id: 10,
        value: 0
      }, {
        name: 'North Indian',
        id: 20,
        value: 0
      }, {
        name: 'Punjabi',
        id: 30,
        value: 0
      }, {
        name: 'Maharastrian',
        id: 40,
        value: 0
      }]
    }, {
      name: 'Meal Type',
      id: 3,
      value: 'meal',
      subItems: [{
        name: 'Breakfast',
        id: 10,
        value: 0
      }, {
        name: 'Lunch',
        id: 20,
        value: 0
      }, {
        name: 'Dinner',
        id: 30,
        value: 0
      }]
    }, {
      name: 'Meal Options',
      id: 4,
      value: 'mealOptions',
      subItems: [{
        name: 'Others',
        id: 10,
        value: 0
      }, {
        name: 'Salads',
        id: 20,
        value: 0
      }, {
        name: 'Diabetic',
        id: 30,
        value: 0
      }]
    }];
    self.menu = self.mainMenu;
    self.mainMenuSelected = true;
    self.subMenuSelected = false;
    self.menuOpened = false;
    self.toggleFilter = function() {
      self.menuOpened = !(self.menuOpened);
    };

    self.menuItemTap = function($event, overLayItem) {
      if (overLayItem.subItems) {
        self.subMenuSelected = true;
        self.mainMenuSelected = false;
        self.menu = overLayItem.subItems;
      }
    };

    self.backFromFilter = function() {
      self.menu = self.mainMenu;
      self.mainMenuSelected = true;
      self.subMenuSelected = false;
    };

    self.fliterSelected = function() {
      var selectedArr = [];
      angular.forEach(self.mainMenu, function(record) {
        angular.forEach(record.subItems, function(subRecord) {
          if (subRecord.value) {
            selectedArr.push(subRecord);
          }
        });
      });
      //Ajax request for the array.
      console.log(selectedArr);
      if (ReceipeHelperService) {
        // var data=selectedArr; //Real API bind the data
        ReceipeHelperService.applyFilterRecipe()
          .success(function(response) {
            console.log("success response");
            console.log(response);

            switch (self.selectedTab) {
              case 'allReceipe':
                self.recipesList.items = response;
                break;
              case 'recommended':
                self.recipesListrecommended = response;
                break;
              case 'favourite':
                self.recipesListfavourite = response;
                break;
              case 'myRecipes':
                self.recipesListmy = response;
                break;
            }
          }).error(function(response) {
            console.log("failure responsnulls menu");
            console.log(response);
          });
      }
      self.toggleFilter();
    };


  });