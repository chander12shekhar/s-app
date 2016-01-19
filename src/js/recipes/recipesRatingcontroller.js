angular.module('FoodeeBuddee.controllers.RecipesRating', [])
  .controller('RecipesRatingController', function($scope, ResourcesList, RecipesResource, ReceipeRatingFactory, $location, ReceipeHelperService, $routeParams, $rootScope, SharedState, SearchService, SubscriberService) {
    var self = this;
    self.selectedRecord = null;
    SharedState.initialize($scope, 'modalReview');
    SharedState.initialize($scope, 'modalRating');

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    self.receipeRating = new ReceipeRatingFactory();

    self.averageRatingMenu = self.receipeRating.averageRatingMenu;
    self.advanceRatingMenu = self.receipeRating.advanceRatingMenu;
    self.basicRating= null;
    $scope.secondaryNavModel ={title: 'RECIPE ADVANCE RATING'};
    /*
    if (ReceipeHelperService) {
            //Get Basic Rating Menu
            ReceipeHelperService.getReceipeBasicRating()
              .success(function(response) {
                console.log("success response");
                self.averageRatingMenu = response;
                console.log(response.advanceRating);

              })
              .error(function(response) {
                  console.log("failure response Basic Initializing menu");
                  console.log(response);
              });

          //Get Advannce Rating menu
          ReceipeHelperService.getReceipeAdvanceRating()
            .success(function(response) {
              console.log("success response");
              self.advanceRatingMenu = response.advanceRating;
              console.log(response.advanceRating);
            })
            .error(function(response) {
              console.log("failure response Advance Initializing menu");
              console.log(response);
            });
        } // if
     */   

    self.mode = "normal";
    self.submitRating = function(submitType) {
      console.log("Submit Rating ++");
      console.log(self.advanceRatingMenu);
      console.log("Need to make a Post rating API call");
      var data = new Array(),
      recordModel = self.advanceRatingMenu;

      self.url = $location.url();
      if (submitType === 'average') {
        recordModel = self.averageRatingMenu;
        $location.url("/recipes/reviewBody/" + $routeParams.id);
      }else if (self.url  == ("/recipes/review/advanceRating/"+ $routeParams.id)) {
        $location.url("/recipes/reviewBody/" + $routeParams.id);
      } else {
        //self.url = $location.url();
        self.goback();
      }

      angular.forEach(recordModel, function(record) {
        angular.forEach(record.item, function(submenu) {
          data.push(submenu);
        });
      });

      if (ReceipeHelperService) {
        ReceipeHelperService.submitReceipeRating(data)
          .success(function(response) {
            console.log("submitReceipeRating success response");
            console.log(response);
          })
          .error(function(response) {
            console.log(" submitReceipeRating  failure response");
            console.log(response);
          });
      }
      console.log("Submit Rating --");

    };

    self.goback = function() {
      window.history.back();
    };

    self.goAdvancedRating = function() {
      self.mode = "modalAdvanceRating";
      $location.url("/recipes/review/advanceRating/" + $routeParams.id);
    };

    self.showModalReview = function() {
      $rootScope.Ui.toggle('modalReview');
    };

    self.goAdvancedReview = function() {
        self.mode = "modalAdvanceReview";
        $location.url('/recipes/advancedReview/' + $routeParams.id);
    };

    self.goFullReview = function() {
        self.mode = "modalAdvanceReview";
        $location.url("/recipes/reviewBody/" + $routeParams.id);
    };

    self.submitReview = function() {
            var data = self.basicRating;
            if (ReceipeHelperService) {
                var reviewPostAction = self.isAdvancedReview ? ReceipeHelperService.advanceReviewCreate : ReceipeHelperService.basicreviewCreate;
                reviewPostAction(data).success(function(response) {
                    console.log("submitReceipeRating success response");
                    console.log(response);
                    $location.url('/recipes/' + $routeParams.id);
                }).error(function(response) {
                    console.log(" submitReceipeRating  failure response");
                    console.log(response);
                    $location.url('/recipes/' + $routeParams.id);
                });
            }
        };
  });