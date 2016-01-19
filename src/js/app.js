angular.module('FoodeeBuddee', [
  'ngMap',
  'ngRoute',
  'ngCookies',
  'fallbackSrc',
  'rating',
  'imageViewer',
  'infinite-scroll',
  'mobile-angular-ui',
  'ui.router',
  'ngCordova',
  'preparationProcessBuilderModule',
  'ingredientBuilderModule',
  'reviewBuilderModule',
  'reviewDetailBuilderModule',
  'reviewRatingBuilderModule',
  'yummyfavoriteBuilderModule',
  'FoodeeBuddee.receipe.helper',
  'FoodeeBuddee.eateries.common.helper',
  'FoodeeBuddee.controllers.Login',
  'FoodeeBuddee.controllers.Footer',
  'FoodeeBuddee.controllers.Register',
  'FoodeeBuddee.controllers.EateriesList',
  'FoodeeBuddee.controllers.RecipesList',
  'FoodeeBuddee.controllers.RecipeDetail',
  'FoodeeBuddee.controllers.BlogsList',
  'FoodeeBuddee.controllers.Eatery',
  'FoodeeBuddee.services.User',
  'FoodeeBuddee.services.Storage',
  'FoodeeBuddee.services.Main',
  'FoodeeBuddee.services.Authorization',
  'FoodeeBuddee.services.FoodeeAuth',
  'FoodeeBuddee.services.ResourcesList',
  'FoodeeBuddee.resources.Eateries',
  'FoodeeBuddee.resources.Recipes',
  'FoodeeBuddee.resources.Reviews',
  'FoodeeBuddee.resources.Blogs',
  'FoodeeBuddee.factories.ReceipeRating',
  'FoodeeBuddee.factories.EateryRating',
  'FoodeeBuddee.factories.IndexModel',
  'FoodeeBuddee.controllers.EateryHomeController',
  'FoodeeBuddee.controllers.RecipeHomeController',
  'FoodeeBuddee.controllers.RecipesRating',
  'FoodeeBuddee.controllers.EateriesRating',
  'djds4rce.angular-socialshare',
  'FoodeeBuddee.controllers.Message',
  'ngOpenFB',
  'FoodeeBuddee.services.Subscriber',
  'FoodeeBuddee.services.UserModel',
  'FoodeeBuddee.services.Google',
  'FoodeeBuddee.provider.inAppBrowser',
  'FoodeeBuddee.controllers.Index',
  'FoodeeBuddee.resources.EateriesList',
  'CustomFilter',
  'FoodeeBuddee.services.Network',
  'FoodeeBuddee.factories.Eatery',
  'FoodeeBuddee.directives.Places',
  'angularjs-dropdown-multiselect',
  'FoodeeBuddee.eatery.helper',
  'FoodeeBuddee.services.Camera',
  'FoodeeBuddee.services.Cordova',
  'FoodeeBuddee.controllers.Leaderboard',
  'FoodeeBuddee.controllers.Social',
  'FoodeeBuddee.services.LeaderBoard',
  'mobile-angular-ui.components.modals',
  'FoodeeBuddee.controllers.Review',
  'FoodeeBuddee.models.LeaderBoard',
  'FoodeeBuddee.controllers.ModalController',
  'mobile-angular-ui.core.sharedState',
  'FoodeeBuddee.controllers.Search',
  'FoodeeBuddee.services.Search',
  'ui.bootstrap.typeahead',
  'FoodeeBuddee.directives.Password',
  'angular-svg-round-progress',
  'ngCordovaOauth',
  'ui.bootstrap.buttons',
  'FoodeeBuddee.services.Register',
  'FoodeeBuddee.services.ProfileSettingsService',
  'FoodeeBuddee.controllers.Front',
  'FoodeeBuddee.services.Social',
  'FoodeeBuddee.controllers.ReviewDetail',
  'FoodeeBuddee.resources.RecipesList',
  'FoodeeBuddee.controllers.VouchersList',
  'FoodeeBuddee.resources.VouchersList',
  'FoodeeBuddee.services.Voucher',
  'FoodeeBuddee.controllers.Settings',
  'FoodeeBuddee.directives.Social',
  'FoodeeBuddee.services.FileStorage',
  'FoodeeBuddee.directives.Footer',
  'FoodeeBuddee.services.Eatery',
  'FoodeeBuddee.controllers.SocialPost',
  'FoodeeBuddee.service.SocialPost',
  'base64',
  'FoodeeBuddee.controllers.EateryReview',
  'FoodeeBuddee.resources.EateryReview',
  'FoodeeBuddee.services.Browse',
  'FoodeeBuddee.services.location',
  'FoodeeBuddee.controllers.SocialCheck',
  'FoodeeBuddee.controllers.SocialCheckinFinal',
  'FoodeeBuddee.services.InAppFilter',
  'ngCordovaOauth',
  'FoodeeBuddee.services.platform',
  'foodeebuddee.config'
]).value('THROTTLE_MILLISECONDS', 250)
  .run(['$cordovaSocialSharing', 'NetworkService', '$rootScope', '$location',
    function ($cordovaSocialSharing, NetworkService, $rootScope, $location) {

      var connectionChecker = new NetworkService();

      $rootScope.$on('$locationChangeSuccess', function () {

        var path = $location.path();
        var url = $location.url();
        if ($location) {

          if (url == '/' || url == '/login') {
            if ($rootScope)
              $rootScope.$emit('hidebackbutton');
          }
          else {
            if ($rootScope)
              $rootScope.$emit('showbackbutton');
          }
        }

      });

    }])
  .factory('MyInter', ['$q', 'StorageService',
    function ($q, StorageService) {
      return {
        request: function (config) {
          var user = StorageService.getItem('user');
          if (user !== null && user.token !== '') {
            config['headers']['X-CSRF-TOKEN'] = user.token;
          }
          return config;
        }
      };
    }
  ]).constant('serverUrl', '/* @echo SERVER_URL */').config(['$routeProvider', '$httpProvider', '$locationProvider', '$stateProvider',
  function ($routeProvider, $httpProvider, $locationProvider, $stateProvider) {
    $httpProvider.interceptors.push('MyInter');

    /*$routeProvider.when('/', {
     templateUrl: 'home.html',
     reloadOnSearch: false
     })*/

    $routeProvider.when('/', {
        templateUrl: 'home.html',
        reloadOnSearch: false,
        controller: 'IndexController as indexCtrl'
      })
      .when('/aboutus', {
        templateUrl: 'aboutus.html',
        reloadOnSearch: false
      })
      .when('/tandc', {
        templateUrl: 'tandc.html',
        reloadOnSearch: false
      })
      .when('/login', {
        templateUrl: 'login.html',
        reloadOnSearch: false
      })
      .when('/settings', {
        templateUrl: 'user/settings.html',
        reloadOnSearch: false
      })
      .when('/new-account', {
        templateUrl: 'new-account.html',
        reloadOnSearch: false
      })
      .when('/eateries', {
        templateUrl: 'eateries/eateries.html',
        reloadOnSearch: false,
        controller: 'EateryHomeController as eatHomeCtrl'
      })
      .when('/recipes', {
        templateUrl: 'receipe/recipes.html',
        reloadOnSearch: false,
        controller: 'RecipeHomeController as recipeHomeCtrl'
      })
      .when('/blogs', {
        templateUrl: 'blogs/blogs.html',
        reloadOnSearch: false
      })
      .when('/eateries/list/:filter', {
        templateUrl: 'eateries/eateries-list.html',
        reloadOnSearch: false
      })
      .when('/recipes/all', {
        templateUrl: 'receipe/recipes-list.html',
        reloadOnSearch: false
      })
      .when('/blogs/all', {
        templateUrl: 'blogs/blogs-list.html',
        reloadOnSearch: false
      })
      .when('/eateries/:id', {
        templateUrl: 'eateries/eatery.html',
        reloadOnSearch: false
      })
      .when('/recipes/:id', {
        templateUrl: 'receipe/receipe.html',
        reloadOnSearch: false
      })
      .when('/recipes/advanceRating/:id', {
        templateUrl: 'receipe/receipe-advanceratingview.html',
        reloadOnSearch: false
      })
      .when('/eateries/advanceRating/:id', {
        templateUrl: 'eateries/eateries-advanceratingview.html',
        reloadOnSearch: false
      })
      .when('/eateries/reviewLaunch/:id', {
        templateUrl: 'receipe/review-launch.html',
        reloadOnSearch: false
      })
      .when('/eateries/ratings/:id', {
        templateUrl: 'eateries/advanced-rating.html',
        reloadOnSearch: false
      })
      .when('/eateries/review/:id', {
        templateUrl: 'eateries/reviews.html',
        reloadOnSearch: false
      })
      .when('/eateries/viewAdvReview/:blogId/:id', {
        templateUrl: 'eateries/view-advanced-review.html',
        reloadOnSearch: false
      })
      .when('/eateries/viewSimpleReview/:reviewId/:id', {
        templateUrl: 'eateries/view-simple-review.html',
        reloadOnSearch: false
      })
      .when('/eateries/advReview/:id', {
        templateUrl: 'eateries/advanced-review.html',
        reloadOnSearch: false
      })
      .when('/recipes/reviewLaunch/:id', {
        templateUrl: 'receipe/review-launch.html',
        reloadOnSearch: false
      })
      .when('/recipes/reviewBody/:id', {
        templateUrl: 'receipe/review-body.html',
        reloadOnSearch: false,
        controller: "ReviewController as rvCtrl"
      })
      .when('/eatery/new', {
        templateUrl: 'eateries/new-eatery.html',
        reloadOnSearch: false
      })
      .when('/recipes/review/advanceRating/:id', {
        templateUrl: 'receipe/receipe-advanceratingview.html',
        reloadOnSearch: false
      })
      .when('/leaderboard/me', {
        templateUrl: 'leaderboard/me.html',
        reloadOnSearch: false
      })
      .when('/add-spice', {
        templateUrl: 'user/add-spice.html',
        controller: 'RegisterController as regCtrl',
        reloadOnSearch: false
      })
      .when('/meal-preference', {
        templateUrl: 'user/meal-preference.html',
//        controller: 'RegisterController as regCtrl',
        reloadOnSearch: false
      })
      .when('/registration-success', {
        templateUrl: 'user/registration-success.html',
//        controller: 'RegisterController as regCtrl',
        reloadOnSearch: false
      })
      .when('/profile', {
        templateUrl: 'user/profile.html',
        reloadOnSearch: false
      })
      .when('/social', {
        templateUrl: 'social/me.html',
        reloadOnSearch: false
      })
      .when('/socials/post', {
        templateUrl: 'social/post.html',
        reloadOnSearch: false
      })
      .when('/socials/checkin', {
        templateUrl: 'social/checkin.html',
        reloadOnSearch: false
      })
      .when('/recipes/advancedReview/:id', {
        templateUrl: 'receipe/receipe-advancedreview.html',
        reloadOnSearch: false,
        controller: "ReviewDetailController as receipeCtrl"
      })
      .when('/vouchers/home', {
        templateUrl: 'vouchers/home.html',
        reloadOnSearch: false
      })
      .when('/vouchers/list/:slug', {
        templateUrl: 'vouchers/list.html',
        reloadOnSearch: false
      })
      .when('/vouchers/view/:id', {
        templateUrl: 'vouchers/view.html',
        reloadOnSearch: false
      })
      .when('/refcode', {
        templateUrl: 'refcode.html',
        reloadOnSearch: false
      })
      .when('/forgotPassword', {
        templateUrl: 'forgot-password.html',
        reloadOnSearch: false
      })
      .when('/socials/checkin/:slug', {
        templateUrl: 'social/checkin-with-status.html',
        reloadOnSearch: false
      })
      .when('/eateries/rating/:id', {
        templateUrl: 'eateries/ratings.html',
        reloadOnSearch: false
      })
      .when('/privacy', {
        templateUrl: 'user/privacy.html',
        reloadOnSearch: false
      })
      .when('/editProfile', {
        templateUrl: 'user/edit-profile.html',
        reloadOnSearch: false
      })
      .when('/changePassword', {
        templateUrl: 'change-password.html',
        reloadOnSearch: false
      });

  }

]);


var handleOpenURL = function(url) {
  console.log("RECEIVED URL: " + url);
  var res = url.split('://');
  window.location='main.html#/' + res[1];
};