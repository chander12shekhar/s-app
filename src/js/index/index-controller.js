angular.module('FoodeeBuddee.controllers.Index', [])
  .controller('IndexController', function (UserService, IndexModelFactory, SettingsService, NavigatorService) {
    var self = this;

    NavigatorService.setCurrent('/');
    NavigatorService.setPrevious(null);

    self.indexModel = new IndexModelFactory();
    self.menu = self.indexModel.indexMenu;
    self.recipesActive = SettingsService.isRecipeModuleActive;


    return {
      isLogged: function () {
        return UserService.isLogged();
      }
    };


  })