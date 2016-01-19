angular.module('FoodeeBuddee.controllers.Front', [])
  .controller('FrontController', function($rootScope, StorageService, SearchService, UserService, SubscriberService, $sce,
    NavigatorService, $timeout) {
    var self = this;

    self.container = 'logo';
    self.buttonLabel = 'Get Started';

    self.searchShow = SearchService.hide;


    SubscriberService.subscribe('searchBar', function() {
      self.searchShow = SearchService.hide;
    });

    SubscriberService.subscribe('login', function() {
      self.loggedIn = UserService.isLogged();
    });

    self.loggedIn = UserService.isLogged();


    self.toggleSearch = function () {
      SearchService.toggleSearchBar();
      self.searchShow = SearchService.hide;
      $timeout(function () {
          $("#search-box").focus();
      }, 0, false);
      if (self.searchShow === false)
        {
            if($(".scrollable").hasClass('main-body-top'))
              $(".scrollable").addClass('main-body-top-search');
            else if($(".scrollable").hasClass('about-us-top')){
                $(".scrollable").addClass('about-us-top-search');
            }
            else
              $(".scrollable").addClass('body-top-search');
        }
       else{
          $(".scrollable").removeClass('body-top-search');
          $(".scrollable").removeClass('about-us-top-search');
          $(".scrollable").removeClass('main-body-top-search');
       }
    };

    self.show = StorageService.getBoolean('frontpage');

    self.buttonAction = function() {
      if(self.buttonLabel === 'Get Started') {
        self.videoContainer = $sce.trustAsHtml('<iframe width="100%" height="400" src="https://www.youtube.com/embed/sPBXh6Xg8n4?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        self.video = 'hey';
        self.buttonLabel = 'Skip Intro';
      }else if(self.buttonLabel === 'Skip Intro') {
        self.video = null;
        self.videoContainer = '';
        self.container = 'logo';
        self.show = true;
        StorageService.setItem('frontpage', true);
      }
    };

    self.mainVideo = function() {
        self.videoContainer = $sce.trustAsHtml('<iframe width="100%" height="400" src="https://www.youtube.com/embed/sPBXh6Xg8n4?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        $('.scrollable-content').animate({scrollTop: 0}, 800, 'swing');
        self.video = 'hey';
    };

    self.eateryVideo = function() {
        self.videoContainer = $sce.trustAsHtml('<iframe width="100%" height="400" src="https://www.youtube.com/embed/DZ7v_AIKIPg?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        $('.scrollable-content').animate({scrollTop: 0}, 800, 'swing');
        self.video = 'hey';
    };

    self.voucherVideo = function() {
        self.videoContainer = $sce.trustAsHtml('<iframe width="100%" height="400" src="https://www.youtube.com/embed/6V5DWxZvH3M?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        $('.scrollable-content').animate({scrollTop: 0}, 800, 'swing');
        self.video = 'hey';
    };

    self.socialVideo = function() {
        self.videoContainer = $sce.trustAsHtml('<iframe width="100%" height="400" src="https://www.youtube.com/embed/UyLEgUlC-GY?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        $('.scrollable-content').animate({scrollTop: 0}, 800, 'swing');
        self.video = 'hey';
    };

    self.lbVideo = function() {
        self.videoContainer = $sce.trustAsHtml('<iframe width="100%" height="400" src="https://www.youtube.com/embed/-qutBgSgHms?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        $('.scrollable-content').animate({scrollTop: 0}, 800, 'swing');
        self.video = 'hey';
    };

    self.recipeVideo = function() {
        self.videoContainer = $sce.trustAsHtml('<iframe width="100%" height="400" src="https://www.youtube.com/embed/at-FoAgYw5c?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        $('.scrollable-content').animate({scrollTop: 0}, 800, 'swing');
        self.video = 'hey';
    };

    self.backHandler = function() {
      //console.log(NavigatorService.hasPrevious());
      NavigatorService.goBack();
    };

    self.isBackVisible = function() {
      return NavigatorService.hasPrevious();
    };

    self.showBackButton = function () {
      self.backbuttonenable = true;
    };



  });