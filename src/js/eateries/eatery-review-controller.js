angular.module('FoodeeBuddee.controllers.EateryReview', [])
  .controller('EateryReviewController',
  function ($scope, StorageService, EateriesResource, NavigatorService, $routeParams, EateryHelperService,
            EateryHelperService, MessageService, $location, SharedState, ResourcesList,
            EateriesReviewResource, ReviewsResource, BlogsResource, SearchService, SubscriberService,$cordovaDialogs ) {

    SharedState.initialize($scope, 'activeTab');
    SharedState.set('activeTab', 1);

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    var self = this;
    self.user = StorageService.getItem('user');
    self.logged = StorageService.getBoolean('logged');
    if(!self.logged){
        $location.path('/login');
        MessageService.flush('Please SIGN IN for further actions !', 'warning', null, null);
    }

    self.busy = true;
    self.filter = $routeParams.slug;
    self.reviewsList = {};
    self.simpleReviewTitle = '';
    self.simpleReviewText  = '';
    self.advReviewTitle = '';
    self.advReviewText  = '';
    self.reviewComment  = '';
    self.updatedReviewContent = '';
    self.commentContent = '';

    var eateryId = $routeParams.id;

    var mapping = [];
    mapping['all'] = 1;
    mapping['favourable'] = 2;
    mapping['critical'] = 3;
    mapping['detailed'] = 4;
    mapping['my'] = 5;

    if($routeParams.reviewId === undefined && $routeParams.blogId === undefined ){
      EateriesResource.get({
        id: $routeParams.id
      }).$promise
        .then(function (eatery) {
          if($("#adv-review").val() === 'true'){
            NavigatorService.setCurrent('/eateries/advReview/' + $routeParams.id);
            NavigatorService.setPrevious('/eateries/review/' + $routeParams.id);
          }
          else{
            NavigatorService.setCurrent('/eateries/review/' + $routeParams.id);
            NavigatorService.setPrevious('/eateries/' + $routeParams.id);
          }

          $scope.eatery = eatery;
          if( self.filter === undefined ) self.filter = 'all';
          self.reviewsList= new EateriesReviewResource(self.filter,eateryId);
          self.busy = false;
        });
    }

    self.submitSimpleReview = function() {
      if(EateryHelperService.validateSimpleReview(self.simpleReviewText, self.simpleReviewTitle)){
        self.busy = true;
        EateryHelperService.submitSimpleReview(eateryId, self.simpleReviewText, self.simpleReviewTitle)
          .success(function(data) {
            if (data.id === null || data.id === undefined) {
              MessageService.flush('We could not process your request. Please try again later!', 'danger');
            }
            else {
              self.reviewsList.items.splice(0, 0, data);
              MessageService.flush('Thank you for your review!', 'success');
              self.busy = false;
              $scope.eatery.simpleReview = true;
            }
          })
          .error(function(result) {
            self.busy = false;
          });
      }
    };

    self.submitAdvancedReview = function() {
      if(EateryHelperService.validateAdvReview(self.advReviewTitle,self.advReviewText)){
        self.busy = true;
        EateryHelperService.submitAdvancedReview(eateryId,self.advReviewText,self.advReviewTitle)
          .success(function(data) {
            if(data.message == 'success'){
              MessageService.flush('Thank you for your review!', 'success');
              $location.path('/eateries/review/'+eateryId);
            }
            else{
              MessageService.flush('We could not process your request. Please try again later!', 'danger');
            }
          })
          .error(function(result) {
            self.busy = false;
          });
      }
    };

    self.tabMenuSelected = function (filter) {
      self.busy = true;
      var currentFilter = SharedState.get('activeTab');
      if(currentFilter != mapping[filter]) {
        SharedState.set('activeTab', mapping[self.filter]);
        NavigatorService.setCurrent('/eateries/review/' + filter);
        NavigatorService.setPrevious('/eateries/' + eateryId);
        self.filter = filter;
        self.reviewsList = new EateriesReviewResource(self.filter, eateryId);
        self.busy = false;
      }
    };

    self.review = {};
    if($routeParams.reviewId !== undefined){
      self.busy = true;
      ReviewsResource.get({
        id: $routeParams.reviewId
      }).$promise
        .then(function (review) {
          NavigatorService.setCurrent('/eateries/viewSimpleReview/' + $routeParams.reviewId+'/'+$routeParams.id);
          NavigatorService.setPrevious('/eateries/review/' + $routeParams.id);
          self.review = review;
          self.busy = false;
        });
    }

    self.advReview = {};
    if($routeParams.blogId !== undefined){
      self.busy = true;
      BlogsResource.get({
        id: $routeParams.blogId
      }).$promise
        .then(function (advReview) {
          NavigatorService.setCurrent('/eateries/viewAdvReview/' + $routeParams.blogId+'/'+$routeParams.id);
          NavigatorService.setPrevious('/eateries/review/' + $routeParams.id);
          self.advReview = advReview;
          self.busy = false;
        });
    }

    self.getReviewLink = function(review,eateryId){
      return review.type == 'REVIEW' ? '#/eateries/viewSimpleReview/'+review.id+'/'+eateryId : '#/eateries/viewAdvReview/'+review.id+'/'+eateryId;
    }

    self.likeReview = function (review) {
      EateryHelperService.likeReview(review.id)
        .success(function (data, status) {
          review.like = !review.like;
          var message = review.like ? 'Glad that you LOVE this Review!' : 'Did you not LOVE it?';
          MessageService.flush(message, 'success');
        })
        .error(function (data) {

        });
    };

    self.likeAdvReview = function (advReview) {
      EateryHelperService.likeAdvReview(advReview.id)
        .success(function (data, status) {
          advReview.like = !advReview.like;
          var message = advReview.like ? 'Glad that you LOVE this Review!' : 'Did you not LOVE it?';
          MessageService.flush(message, 'success');
        })
        .error(function (data) {

        });
    };

    //review edit and delete
    self.reviewInProgress = null;
    self.isReviewEdit = false;

    self.checkReviewOwner = function (review, user){
      if(review.creator !== undefined) return review.creator.email == user.email;
      else return false;

    };


    self.cancelEditReview = function (){
      self.reviewInProgress = null;
      self.isReviewEdit = false;
    };

    self.editReview = function (review){
      self.isReviewEdit = true;
      self.updatedReviewContent = review.content;
      self.reviewInProgress = review.id;
    };

    self.reviewEditing = function (id) {
      return id == self.reviewInProgress;
    };

    self.updateReview = function (title, content) {
      if(EateryHelperService.validateSimpleReview(title,content)){
        EateryHelperService.updateReview(self.reviewInProgress, title, content)
          .success(function (data) {
            self.reviewInProgress = null;
            self.isReviewEdit = false;
            self.review.content = self.updatedReviewContent;
            MessageService.flush('Your review was edited successfully!', 'success');
          })
          .error(function (data) {
            MessageService.flush('We could not process your request. Please try again later!', 'danger');
            self.reviewInProgress = null;
          });
      }
    };

    self.updateAdvReview = function (title, content) {
      if(EateryHelperService.validateAdvReview(title,content)){
        EateryHelperService.updateAdvReview(self.reviewInProgress, title, content)
          .success(function (data) {
            self.reviewInProgress = null;
            self.isReviewEdit = false;
            MessageService.flush('Your review was edited successfully!', 'success');
          })
          .error(function (data) {
            MessageService.flush('We could not process your request. Please try again later!', 'danger');
          });
      }
    };

    self.deleteReview = function (review) {
        var message  = 'Are you sure you want to delete?';
        var buttonArray  = ['YES', 'NO'];
        $cordovaDialogs.confirm(message, buttonArray)
        .then(function(buttonIndex) {
          if(buttonIndex == 1){
              self.busy = true;
              EateryHelperService.deleteReview(review.id,'EATERY',eateryId)
                .success(function (data, status) {
                  if(data.message == 'success'){
                    $location.path('/eateries/review/'+eateryId);
                    MessageService.flush('Your review was deleted!', 'success');
                  }
                  else {
                    MessageService.flush('We could not process your request. Please try again later!', 'danger');
                  }
                })
                .error(function (error) {
                });
            }
        });
    };

    self.submitReviewComment = function (id) {
      if(self.reviewComment != ''){
        EateryHelperService.submitReviewComment(id, self.reviewComment)
          .success(function (data) {
            if (data.id === null || data.id === undefined) {
              MessageService.flush('We could not process your request. Please try again later!', 'danger');
            } else {
              self.review.comments.splice(0, 0, data);
              MessageService.flush('Thank you for your comment!', 'success');
              self.reviewComment = '';
            }
          })
          .error(function (data) {
            MessageService.flush('We could not process your request. Please try again later!', 'danger');
          });
      }
    };

    self.submitAdvReviewComment = function (id) {
      if(self.reviewComment != ''){
        EateryHelperService.submitAdvReviewComment(id, self.reviewComment)
          .success(function (data) {
            if (data.id === null || data.id === undefined) {
              MessageService.flush('We could not process your request. Please try again later!', 'danger');
            } else {
              self.advReview.comments.splice(0, 0, data);
              MessageService.flush('Thank you for your comment!', 'success');
              self.reviewComment = '';
            }
          })
          .error(function (data) {
            MessageService.flush('We could not process your request. Please try again later!', 'danger');
          });
      }
    };


    //comment edit and delete
    self.reviewCommentInProgress = null;
    self.isEdit = false;

    self.cancelEditComment = function (){
      self.reviewCommentInProgress = null;
      self.isEdit = false;
    };

    self.checkReviewCommentOwner = function (comment, user){
      if(comment.userAccount !== undefined) return comment.userAccount.email == user.email;
      else return false;
    };

    self.editReviewComment = function (comment) {
      self.isEdit = true;
      self.reviewCommentInProgress = comment.id;
      self.commentContent = comment.commentContent;
    };

    self.reviewCommentEditing = function (id) {
      return id == self.reviewCommentInProgress;
    };

    self.updateReviewComment = function (comment) {
      if(self.commentContent != ''){
        EateryHelperService.updateReviewComment(self.reviewCommentInProgress, self.commentContent)
          .success(function (data) {
            self.isEdit = false;
            self.reviewCommentInProgress = null;
            comment.commentContent = self.commentContent;
            MessageService.flush('Your comment was edited successfully!', 'success');
          })
          .error(function (data) {
            MessageService.flush('We could not process your request. Please try again later!', 'danger');
          });
      }else{
        MessageService.flush('Oops! That cannot be empty!', 'warning');
      }
    };

    self.deleteReviewComment = function (comment,review) {
        var message  = 'Are you sure you want to delete?';
        var buttonArray  = ['YES', 'NO'];
        $cordovaDialogs.confirm(message, buttonArray)
        .then(function(buttonIndex) {
          if(buttonIndex == 1){
              EateryHelperService.deleteReviewComment(comment.id,review.id)
                .success(function (data, status) {
                  if(data.message == 'success'){
                    var index = review.comments.indexOf(comment);
                    review.comments.splice(index, 1);
                    MessageService.flush('Your comment was deleted!', 'success');
                  }
                  else {
                    MessageService.flush('We could not process your request. Please try again later!', 'danger');
                  }
                })
                .error(function (error) {

                });
            }
        });
    };

    self.deleteAdvReviewComment = function (comment) {
        var message  = 'Are you sure you want to delete?';
        var buttonArray  = ['YES', 'NO'];
        $cordovaDialogs.confirm(message, buttonArray)
        .then(function(buttonIndex) {
          if(buttonIndex == 1){
              EateryHelperService.deleteAdvReviewComment(comment.id,self.advReview.id)
                .success(function (data, status) {
                  if(data.message == 'success'){
                    var index = self.advReview.comments.indexOf(comment);
                    self.advReview.comments.splice(index, 1);
                    MessageService.flush('Your comment was deleted!', 'success');
                  }
                  else {
                    MessageService.flush('We could not process your request. Please try again later!', 'danger');
                  }
                })
                .error(function (error) {

                });
            }
        });
    };

    self.viewAdvanceRatingPage = function() {
      $location.path('/eateries/advReview/'+eateryId);
    };
    self.giveSimpleRate = function() {
      $location.path('/eateries/rating/'+eateryId);
    };

    self.makeReviewHelpFull = function (option) {
      EateryHelperService.makeReviewHelpFull(self.review.id,option)
        .success(function (data, status) {
          if(data.message == 'success'){
            self.review.userCritic = true;
            if(option === 'YES'){
                self.review.reviewCritic = true;
                self.review.yesCount++;
            }
            else self.review.reviewCritic = false;
            self.review.totalCounts++;
            MessageService.flush('Thanks for the valuable feedback', 'success');
          }
          else MessageService.flush('We could not process your request. Please try again later!', 'danger');
        })
        .error(function (error) {
            MessageService.flush('We could not process your request. Please try again later!', 'danger');
        });
    };

    self.makeAdvReviewHelpFull = function (option) {
      EateryHelperService.makeAdvReviewHelpFull(self.advReview.id,option)
        .success(function (data, status) {
          if(data.message == 'success'){
            self.advReview.userCritic = true;
            if(option === 'YES'){
                self.advReview.reviewCritic = true;
                self.advReview.yesCount++;
            }
            else self.advReview.reviewCritic = false;
            self.advReview.totalCounts++;
            MessageService.flush('Thanks for the valuable feedback', 'success');
          }
          else MessageService.flush('We could not process your request. Please try again later!', 'danger');
        })
        .error(function (error) {
            MessageService.flush('We could not process your request. Please try again later!', 'danger');
        });
    };
    self.giveSimpleReview = function() {
      $location.path('/eateries/review/'+eateryId);
    };


  });