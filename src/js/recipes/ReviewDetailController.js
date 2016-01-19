angular.module('FoodeeBuddee.controllers.ReviewDetail', [])
  .controller('ReviewDetailController', function($scope, $location, $routeParams, CameraService, ReceipeHelperService, $rootScope, SharedState, $cordovaSocialSharing, SearchService, SubscriberService) {
    var self = this;
    SharedState.initialize($scope, 'modalSocial');

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.isAdvancedReview = false;
    self.review = {
      body: '',
      thumbImagePath: null
    };

    self.goBackHome = function() {
      //Assuming that the create review API returns a review unique id.
      $location.url('/recipes/' + $routeParams.id);
    };


    if (ReceipeHelperService) {
      var data = {
        id: $routeParams.rootId
      };
      ReceipeHelperService.getReviewDetails(data).success(function(response) {
        console.log("submitReceipeRating success response");
        console.log(response);
        self.advanceReview = {
          title: response.title,
          date: response.date,
          reviewContent: response.reviewContent,
          username: response.username,
          overallRating: response.overallRating,
          reviewTitleContent: response.reviewTitleContent
        };
      }).error(function(response) {
        console.log(" submitReceipeRating  failure response");
        console.log(response);
        self.advanceReview = {
          title: "Title of the advanced Review",
          date: "10:11 - 08/08/2015",
          reviewContent: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          username: "User Name",
          overallRating: 4,
          reviewTitleContent: "Review all recipes"
        };
      });
    }

    //Create a footer model to handle the footer items for the view.
    //Wiring tested with -> "#/eateries/advanceRating/'+$routeParams.id
    $scope.footerModel = [{
      name: localeString.footer_Yummy,
      url: '#',
      iconClass: 'foodeebudee-yummy-icon only-three-icons',
      iconTextClass: 'foodeebudee-yummy-icon-text'
    }, {
      name: localeString.footer_Favourite,
      url: '#',
      iconClass: 'icon-FBD-Like'
      // iconTextClass: 'foodeebudee-fav-icon-text'
    }, {
      name: localeString.footer_Share,
      url: '#',
      iconClass: 'fa-share-alt'
    }];

    $scope.reviewLaunch = function(footerModel) {
      switch (footerModel.name) {
        case localeString.footer_Rate:
          $location.url(footerModel.url);
          break;
        case localeString.footer_Yummy:
          self.doPostYummyRecipe();
          break;
        case localeString.footer_Fav:
          self.doPostFavRecipe();
          break;
        case localeString.footer_Share:
          self.showSocialModal();
          break;
      }
    };

    self.doPostYummyRecipe = function() {
      var data = $routeParams.id;
      if (ReceipeHelperService) {
        ReceipeHelperService.addYummyReceipe(data)
          .success(function(response) {
            console.log("submitReceipeRating success response");
            console.log(response);
            //$rootScope.$emit('showMessage', ['Success', 'Post Success']);
            self.showSuccessModal();
          })
          .error(function(response) {
            console.log(" submitReceipeRating  failure response");
            console.log(response);
            //$rootScope.$emit('showMessage', ['Failure', 'Post Failure']);
            self.showFailureModal();
          });
      }
    };
    self.doPostFavRecipe = function() {
      var data = $routeParams.id;

      if (ReceipeHelperService) {
        ReceipeHelperService.addlikeReceipe(data)
          .success(function(response) {
            console.log("submitReceipeRating success response");
            self.showSuccessModal();
          })
          .error(function(response) {
            console.log(" submitReceipeRating  failure response");

            self.showFailureModal();
          });
      }
    };
    self.showSocialModal = function() {
      $rootScope.Ui.toggle('modalSocial');
    };
    self.showSuccessModal = function() {
      $rootScope.Ui.toggle('modalSuccess');
    };
    self.showFailureModal = function() {
      $rootScope.Ui.toggle('modalFailure');
    };
  });