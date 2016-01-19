angular.module('FoodeeBuddee.controllers.RecipeDetail', [])
  .controller('RecipeDetailController', ['$scope', 'RecipesResource', '$routeParams', 'EateriesResource', '$cordovaSocialSharing', 'SharedState', '$location', 'ReceipeHelperService', '$rootScope', 'UserService',
    function($scope, RecipesResource, $routeParams, EateriesResource, $cordovaSocialSharing, SharedState, $location, ReceipeHelperService, $rootScope, UserService, SearchService, SubscriberService) {
      var self = this;
      SharedState.initialize($scope, 'modalSocial');
      SharedState.initialize($scope, 'modalComment');
      SharedState.initialize($scope, 'modalMessage');
      SharedState.initialize($scope, 'modalReview');
      SharedState.initialize($scope, 'modalRating');

      SearchService.hide = true;
      SubscriberService.publish('searchBar');

      self.receipe = null;
      self.showreviewlist = true;
      self.showreviewDetail = false;
      self.CommentsTitle = "Add Comment";
      self.loggedIn = UserService.isLogged();
      self.sharingRecipe=true;

      self.selectedPreprationRecord = null;
      self.selectedItem = null;

      self.secondaryNavModel = {
        title: 'Review',
        leftBtn: {
          title: 'FILTER',
          icon: 'fa-filter'

        },
        rightBtn: null
      };
      self.menuOpened = false;

      self.reviewOverlayModel = [{
        name: localeString.review_FilterMenu_All
      }, {
        name: localeString.review_FilterMenu_Favourable
      }, {
        name: localeString.review_FilterMenu_Critical
      }, {
        name: localeString.review_FilterMenu_Detailed
      }, {
        name: localeString.review_FilterMenu_MyReviews
      }];

      self.receipe_Ingredients = localeString.Receipe_Ingredients_Tab;
      self.receipe_Preparation_Process_Tab = localeString.Receipe_Preparation_Process_Tab;
      self.receipe_Review_Tab = localeString.Receipe_Review_Tab;
      self.receipe_Preparation_Process_AdditionalNotes = localeString.Receipe_Preparation_Process_AdditionalNotes;
      self.receipe_Others_Tab = 'Recipe history';
      self.receipe_Rating_Tab = "Rating";

      RecipesResource.get({
        id: $routeParams.id
      }).$promise.then(function(receipe) {

        self.receipe = receipe;

        self.receipe.totalCookingTime = receipe.totalCookingHours + " h " + receipe.totalCookingMinutes + " mins " + receipe.totalCookingSecs + " secs";
        self.receipe.totalPreparationTime = receipe.totalHours + " h " + receipe.totalMinutes + " mins " + receipe.totalSecs + " secs";

        self.receipe.yummyDetail = {
          "yummyCount": receipe.yummyCount,
          "favouriteCount": receipe.favouriteCount
        };

        self.receipe.serves = "Serves ";
        self.receipe.totalViews = "Total views ";

        self.additionalNotes = self.receipe.additionalNotes;

        self.Others = self.receipe.others;


        self.receipe.allReceipe = "All receipes of " + self.receipe.author;
        self.recipeIngredientsList = self.receipe.recipeIngredientsList;
        self.preparation_ProcessList = self.receipe.preparationProcessSteps;

        if (self.preparation_ProcessList.photos === undefined) {
          self.preparation_ProcessList.photos = new Array();
        }
        angular.forEach(self.receipe.preparationProcessSteps, function(record) {
          if (record && record.file) {
            self.preparation_ProcessList.photos.push(record.file);
            record.photos = new Array();
            record.photos.push(record.file);
          }
        });

        self.recipeReviews = self.receipe.recipeReviews;

        self.reviewFilterMenuItems();

        self.PreparationTime = localeString.PreparationTime;
        self.allCusines = [{
          label: localeString.Cuisine_Type,
          name: self.receipe.cuisines[0].name
        }, {
          label: localeString.Sub_Cuisine,
          name: ''
        }, {
          label: localeString.Meal_Options,
          name: self.receipe.mealTypes[0].name
        }, {
          label: localeString.Dietary_Options,
          name: self.receipe.dietaryOptions.name
        }];
        self.total_prep_time = localeString.total_prep_time;
        self.total_cook_time = localeString.total_cook_time;
        self.storyof_recipe = localeString.StoryOf_Recipe;
        self.waysToEat_recipe = localeString.WaysToEat_Recipe;
        self.historyOf_Recipe = localeString.HistoryOf_Recipe;
        self.processTime();
      });
      self.processTime = function() {

        // To do Will use filter and avoid below code...
        angular.forEach(self.receipe.preparationProcessSteps, function(preparationProcessSteps) {
            if (preparationProcessSteps) {
              if ((preparationProcessSteps.preparationHours > 0) && (preparationProcessSteps.preparationMinutes > 0) && (
                  preparationProcessSteps.preparationSecs > 0)) {
                preparationProcessSteps.preaparationTime = preparationProcessSteps.preparationHours + " Hr. " +
                  preparationProcessSteps.preparationMinutes + " Min. " + preparationProcessSteps.preparationSecs +
                  " Sec";
              } else if ((preparationProcessSteps.preparationMinutes > 0) && (preparationProcessSteps.preparationSecs > 0)) {
                preparationProcessSteps.preaparationTime = preparationProcessSteps.preparationMinutes + " Min. " +
                  preparationProcessSteps.preparationSecs + " Sec";
              } else if ((preparationProcessSteps.preparationSecs > 0)) {
                preparationProcessSteps.preaparationTime = preparationProcessSteps.preparationSecs + " Sec";
              } else {
                if (preparationProcessSteps.preparationHours > 0) {
                  preparationProcessSteps.preaparationTime = preparationProcessSteps.preparationHours + " Hr. ";
                } else if (preparationProcessSteps.preparationMinutes > 0) {
                  preparationProcessSteps.preaparationTime = preparationProcessSteps.preparationMinutes + " Min. ";
                }
              }

            }

          }


        );

      };
      self.checkSocialSharePlugin = function() {
        window.plugins.socialsharing.available(function(isAvailable) {
          // the boolean is only false on iOS < 6
          if (isAvailable) {
            // now use any of the share() functions
            console.log("Social Sharing is available");
          } else {
            console.log("Service is not available");
            self.showFutureInProgressModal();
          }
        });
      };
      self.shareViaSheet = function() {
        if ($cordovaSocialSharing) {
          $cordovaSocialSharing
            .share(message, subject, file, link) // Share via native share sheet
            .then(function(result) {

              console.log("Share Via post Success");
              // Success!
            }, function(err) {
              // An error occured. Show a message to the user
              console.log("Service got Failure");
            });
        } else {
          self.showFutureInProgressModal();

        }

      };
      self.shareViaMail = function() {
        var message=self.receipe.socialSharingfooddiebuddie.message;
        var subject=self.receipe.socialSharingfooddiebuddie.subject;
        var toArr="gmail.com";
        var ccArr="fooddiebuddie@gmail.com";
        var subject="FoodeeBuddee Sharing";
        var body=message;
        var file=self.receipe.socialSharingfooddiebuddie.link;
  
       if ($cordovaSocialSharing) {
          $cordovaSocialSharing
            .shareViaEmail(message, subject, toArr, ccArr, bccArr, file)// Share via native share sheet
            .then(function(result) {

              console.log("Share Via post Success");
              // Success!
            }, function(err) {
              // An error occured. Show a message to the user
              console.log("Service got Failure");
            });
        } else {
          self.showFutureInProgressModal();

        }
      };
      self.shareViaFaceBook = function() {
        var message = null;
        var image = null;
        var link = null;

        message = (self.sharingRecipe)?self.receipe.socialSharingFacebook.message:self.shareReview.socialSharingFacebook.message;
        image = (self.sharingRecipe)?self.receipe.socialSharingFacebook.fullImageThumbPath:self.shareReview.socialSharingFacebook.message;
        link = (self.sharingRecipe)?self.receipe.socialSharingFacebook.link:self.shareReview.socialSharingFacebook.message;

        if ($cordovaSocialSharing) {
          $cordovaSocialSharing
            .shareViaFacebook(message, image, link) // Share via native share sheet
            .then(function(result) {
              console.log("Face book post Success");
              // Success!
            }, function(err) {
              // An error occured. Show a message to the user
              console.log("Face book post Failure");
            });
        } else {
          self.showFutureInProgressModal();

        }

      };
      self.shareViaTwitter = function() {

        var message = null;
        var image = null;
        var link = null;

        /*message = "Foodie buddie Receipe";
        image = null;
        link = "https://twitter.com/foodeebuddee"; */
        
        message =(self.sharingRecipe)?self.receipe.socialSharingTwitter.message:self.shareReview.socialSharingTwitter.message;
        image = (self.sharingRecipe)?self.receipe.socialSharingTwitter.fullImageThumbPath:self.shareReview.socialSharingTwitter.fullImageThumbPath;
        link = (self.sharingRecipe)?self.receipe.socialSharingTwitter.link:self.shareReview.socialSharingTwitter.link;

        if(!self.sharingRecipe)
        self.sharingRecipe=true; 
        $cordovaSocialSharing
          .shareViaTwitter(message, image, link)
          .then(function(result) {
            // Success!
            console.log("Twitter post Success");
          }, function(err) {
            // An error occurred. Show a message to the user
            console.log("Twitter post Failure");
            self.showFutureInProgressModal();
          });
      };
      self.shareViaGoogleplus = function() {

        var message = null;
        var image = null;
        var link = null;
        var app = null;

        message = "Foodie buddie Receipe";
        image = null;
        link = "https://plus.google.com/+foodeebuddee/posts";

        if(self.receipe.socialSharinggoogleplus){
         message = (self.sharingRecipe)?self.receipe.socialSharinggoogleplus.message:self.shareReview.socialSharinggoogleplus.message;
        image = (self.sharingRecipe)?self.receipe.socialSharinggoogleplus.fullImageThumbPath:self.shareReview.socialSharinggoogleplus.fullImageThumbPath;
        link = (self.sharingRecipe)?self.receipe.socialSharinggoogleplus.link:self.shareReview.socialSharinggoogleplus.link;
      }
      if(!self.sharingRecipe)
        self.sharingRecipe=true;

        if (OSName == "Android") {
          app = "com.google.android.apps.plus";
        } else {
          self.showFutureInProgressModal();
          return;
        }
          $cordovaSocialSharing
          .shareVia(app, message, image, link)
          .then(function(result) {
            // Success!
            console.log("Google Plus post Success");
          }, function(err) {
            // An error occurred. Show a message to the user
            self.showFutureInProgressModal();
            console.log("Google Plus post Failure");
          });


      };


      self.shareViaFoodeeBuddee = function() {
        self.showFutureInProgressModal();
      };
      $scope.selectedReviewList = function(selectedItem) {
        console.log("Selected Review List Item ++");
        console.log(selectedItem);
        // self.showFutureInProgressModal();
        if (self.loggedIn) {
          switch (selectedItem.name) {
            case 'Share':
              self.sharingRecipe=false;
              self.shareReview=selectedItem;
              self.showSocialModal();
              break;
            case 'Yummy':
              self.doaddYummyReceipe(selectedItem.name);
              break;
            default:
              {
                self.showreviewlist = false;
                self.showreviewDetail = true;
                $rootScope.$emit('hidebackbutton');
                self.selectedItem = selectedItem;


                //Make ajax call 

                var data = $routeParams.id;

                if (ReceipeHelperService) {
                  //Get Basic Rating Menu
                  ReceipeHelperService.getComment(data)
                    .success(function(response) {
                      console.log("success response");
                      self.selectedItem.comments = response.comments;
                      console.log(self.selectedItem.comments);
                      console.log(self.selectedItem.comments);

                    })
                    .error(function(response) {
                      console.log("failure response getComment***  menu");
                      console.log(response);
                    });

                } // if



                self.secondaryNavModel = {
                  title: 'Review',
                  leftBtn: null,
                  rightBtn: {
                    title: 'Back',
                    icon: 'fa fa-arrow-left'

                  }
                };
              }
              break;
          }
        } else {

          switch (selectedItem.name) {
            case 'Share':
              self.showSocialModal();
              break;
            case 'Yummy':
              self.showModalUserDoestnotAuthorized();
              break;
            default:
              {
                self.showreviewlist = false;
                self.showreviewDetail = true;
                self.selectedItem = selectedItem;
                //Need to Fill Input Parameter to REview id and receipe id
                var data = $routeParams.id;

                if (ReceipeHelperService) {
                  //Get Basic Rating Menu
                  ReceipeHelperService.getComment(data)
                    .success(function(response) {
                      console.log("success response");
                      self.selectedItem.comments = response.comments;
                      
                    })
                    .error(function(response) {
                      console.log("failure response getComment***  menu");
                      console.log(response);
                    });

                } // if

                self.secondaryNavModel = {
                  title: 'Review',
                  leftBtn: null,
                  rightBtn: {
                    title: 'Back',
                    icon: 'fa fa-arrow-left'

                  }
                };
              }
              break;
          }

        }
        console.log("Selected Review List Item --");
      };

      self.submitComment = function(Comments) {
        console.log("Submit Comment");
        console.log(Comments);
        var data = {
          "comments": self.commentValue
        };

        if (self.CommentMode == "2")
          self.doEditComment(data);
        else
          self.addComment(data);
      };

      $scope.selectedReviewDetailList = function(selectedItem) {
        console.log(selectedItem);
        switch (selectedItem.name) {
          /*
          case 'Share': self.showSocialModal();
            break;
          case 'Like': 
            self.doaddYummyReceipe(selectedItem.name);
            break;
            */
          case 'Comment':
            self.CommentsTitle = "Add Comment";
            self.CommentMode = "1";
            self.showCommentModal();
            break;
          case 'Yes':
          case 'No':
            self.doPostIsUsefulRecipe(selectedItem.name);
            break;
          case 'Edit':
            var id = selectedItem.id;
            if (selectedItem.id == 'EditReviewDetail') {
              console.log("Future in Progress Edit comment");
              self.showFutureInProgressModal();
              return;
            } else {
              console.log("Edit comment");
              console.log("launch model ")
              self.CommentsTitle = "Edit Comment";
              self.CommentMode = "2";
              self.showCommentModal();
            }
            break;
          case 'Delete':

            console.log("Delete comment");
            self.dodeleteComment();
            break;

          default:
            break;
        }
      };

      self.backKeyHandler = function() {
        $rootScope.$emit('showbackbutton');
        self.showreviewlist = true;
        self.showreviewDetail = false;

        self.selectedItem = null;
        self.secondaryNavModel = {
          title: 'Review',
          leftBtn: {
            title: 'FILTER',
            icon: 'fa-filter'
          },
          rightBtn: null
        };

      };
      self.showFilter = function(event) {
        self.toggleMenu(event);
      };

      self.toggleMenu = function(event) {
        self.menuOpened = !(self.menuOpened);
        event.stopPropagation();
      };
      self.reviewMenuItemTap = function(event, overLayItem) {
        if(self.oldSelection){
          //Deselect the selection
          self.oldSelection.value=0;
        }
        self.oldSelection = overLayItem;
        self.menuOpened = !(self.menuOpened);
        switch (overLayItem.name) {
          case "Critical":
            self.recipeReviews = self.receipe.comments_Critical;
            break;
          case "Favourable":
            self.recipeReviews = self.receipe.comments_Favourable;
            break;

          case "Detailed":
            self.recipeReviews = self.receipe.comments_Detailed;
            break;

          case "MyReviews":
            self.recipeReviews = self.receipe.comments_MyReviews;
            break;

          default:
            self.recipeReviews = self.receipe.recipeReviews;
            break;
        }
        overLayItem.value=1;

      };
      self.reviewFilterMenuItems = function() {

        self.receipe.comments_Critical = new Array();
        self.receipe.comments_Favourable = new Array();
        self.receipe.comments_Detailed = new Array();
        self.receipe.comments_MyReviews = new Array();

        angular.forEach(self.receipe.recipeReviews, function(record) {
          switch (record.reviewType) {
            case "Critical":
              self.receipe.comments_Critical.push(record);
              break;

            case "Favourable":
              self.receipe.comments_Favourable.push(record);
              break;

            case "Detailed":
              self.receipe.comments_Detailed.push(record);
              break;

            case "MyReviews":
              self.receipe.comments_MyReviews.push(record);
              break;

            default:
              self.showFutureInProgressModal();
              break;
          }

        });

      };


      $scope.reviewLaunch = function(footerModel) {

        if (self.loggedIn) {
          switch (footerModel.name) {
            case 'Review':
              if (!self.receipe.reviewed) {
                $location.url(footerModel.url);
              } else {
                $location.url("/recipes/reviewBody/" + $routeParams.id);
              }
              break;
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
            default:
              break;
          }
        } else {
          console.log("User Does not logged into application");
          switch (footerModel.name) {
            case localeString.footer_Share:
              self.showSocialModal();
              break;

            case 'Review':
            case localeString.footer_Rate:
            case localeString.footer_Yummy:
            case localeString.footer_Fav:
            default:
              self.showModalUserDoestnotAuthorized();
              break;
          }



        }
      };

      self.doaddYummyReceipe = function() {

        var data = $routeParams.id;

        if (ReceipeHelperService) {
          ReceipeHelperService.addYummyReceipe(data)
            .success(function(response) {
              console.log("doAddYummyReceipe success response");
              console.log(response);
              //$rootScope.$emit('showMessage', ['Success', 'Post Success']);
              self.showSuccessModal();
            })
            .error(function(response) {
              console.log(" doaddYummyReceipe  failure response");
              console.log(response);
              //$rootScope.$emit('showMessage', ['Failure', 'Post Failure']);
              self.showFailureModal();
            });
        }


      };

      self.doPostIsUsefulRecipe = function(param) {

        //Need to sent receipe id and comment id here we have dependency on stub server hence sending one value. 
        var data = $routeParams.id;
        /*
                var data = {
                  "id": $routeParams.id,
                  "answer": param
                } */

        if (ReceipeHelperService) {
          ReceipeHelperService.isUsefulYummyReceipe(data)
            .success(function(response) {
              console.log("isUsefulYummyReceipe success response");
              console.log(response);
              //$rootScope.$emit('showMessage', ['Success', 'Post Success']);
              self.showSuccessModal();
            })
            .error(function(response) {
              console.log(" isUsefulYummyReceipe  failure response");
              console.log(response);
              //$rootScope.$emit('showMessage', ['Failure', 'Post Failure']);
              self.showFailureModal();
            });
        }
      };

      self.dodeleteComment = function() {
        var data = {
          id: $routeParams.id,
        };
        if (ReceipeHelperService) {
          ReceipeHelperService.deleteComment(data)
            .success(function(response) {
              console.log("deleteComment success response");
              console.log(response);
              //$rootScope.$emit('showMessage', ['Success', 'Post Success']);
              var data = $routeParams.id;
              //data.commentId=response.id;
              self.getComment(data);


              self.showSuccessModal();
            })
            .error(function(response) {
              console.log(" deleteComment  failure response");
              console.log(response);
              //$rootScope.$emit('showMessage', ['Failure', 'Post Failure']);
              self.showFailureModal();
            });
        }
      };

      self.doEditComment = function(data) {

        var data = {
          id: $routeParams.id,
          comment: data.comment
        };
        if (ReceipeHelperService) {
          ReceipeHelperService.updateComment(data)
            .success(function(response) {
              console.log("doEditComment success response");
              console.log(response);
              var data = $routeParams.id;
              //data.commentId=response.id;
              self.getComment(data);

              self.showSuccessModal();
            })
            .error(function(response) {
              console.log(" doEditComment  failure response");
              console.log(response);
              //$rootScope.$emit('showMessage', ['Failure', 'Post Failure']);
              self.showFailureModal();
            });
        }
      };
      self.addComment = function(data) {

        var data = {
          id: $routeParams.id,
          comment: data.comment
        };
        if (ReceipeHelperService) {
          ReceipeHelperService.addComment(data)
            .success(function(response) {
              console.log("addComment success response");
              console.log(response);
              var data = $routeParams.id;
              //data.commentId=response.id;
              self.getComment(data);

              self.showSuccessModal();

            })
            .error(function(response) {
              console.log(" addComment  failure response");
              console.log(response);
              var data = $routeParams.id;
              //data.commentId=response.id;
              self.getComment(data);

              self.showFailureModal();
            });
        }
      };

      self.getComment = function(data) {

        if (ReceipeHelperService) {
          //Get Basic Rating Menu
          ReceipeHelperService.getComment(data)
            .success(function(response) {
              self.selectedItem.comments = response.comments;

            })
            .error(function(response) {
              console.log("failure response getComment***  menu");
            });

        }
      };
      self.doPostYummyRecipe = function() {
        var data = $routeParams.id;
        if (ReceipeHelperService) {
          ReceipeHelperService.addYummyReceipe(data)
            .success(function(response) {
              self.showSuccessModal();
            })
            .error(function(response) {
              console.log(" doPostYummyRecipe  failure response");
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

      self.showCommentModal = function() {
        $rootScope.Ui.toggle('modalComment');
      };
      self.showSuccessModal = function() {
        $rootScope.Ui.toggle('modalSuccess');
      };
      self.showFailureModal = function() {
        $rootScope.Ui.toggle('modalFailure');
      };

      self.showFutureInProgressModal = function() {
        $rootScope.Ui.toggle('modalFutureInProgress');
      };
      self.showModalUserDoestnotAuthorized = function() {
        $rootScope.Ui.toggle('modalusernotauthorized');
      };

      //Create a footer model to handle the footer items for the view.
      //Wiring tested with -> "#/eateries/advanceRating/'+$routeParams.id
      $scope.footerModel = [{
        name: 'Review',
        url: "/recipes/reviewLaunch/" + $routeParams.id,
        iconClass: ' fa-pencil-square'
      }, {
        name: localeString.footer_Rate,
        url: '/recipes/advanceRating/' + $routeParams.id,
        iconClass: 'icon-FBD-Rating'
      }, {
        name: localeString.footer_Yummy,
        url: '#',
        iconClass: 'foodeebudee-yummy-icon',
        iconTextClass: 'foodeebudee-yummy-icon-text'
      }, {
        name: localeString.footer_Favourite,
        url: '#',
        iconClass: 'icon-FBD-Like'
      }, {
        name: localeString.footer_Share,
        url: '#',
        iconClass: 'fa-share-alt'
      }];
    }

  ]);