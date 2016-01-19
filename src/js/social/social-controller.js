angular.module('FoodeeBuddee.controllers.Social', [])
  .controller('SocialController', function (StorageService, MessageService, SocialService, ResourcesList, NavigatorService, SearchService, SubscriberService, $location, SharedState,$scope) {

    var self = this;

    self.logged = StorageService.getBoolean('logged');
    if(!self.logged){
        $location.path('/login');
        MessageService.flush('Please SIGN IN for further actions !', 'warning', null, null);
    }
    NavigatorService.setCurrent('/social');
    NavigatorService.setPrevious('/');

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.profileImage = StorageService.getItem('profileImage');
    self.user = StorageService.getItem('user');
    self.text = 'text';
    self.post = {};

    self.user = StorageService.getItem('user');
    self.posts = new ResourcesList(new SocialService());


  });