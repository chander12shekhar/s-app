angular.module('FoodeeBuddee.directives.Social', [])
  .directive('socialItem', function (SocialPostService, MessageService, $cordovaSocialSharing, SettingsService, $location, NavigatorService, SharedState, $cordovaDialogs) {
    return {
      restrict: 'E',
      scope: {
        item: '=item',
        user: '=',
        lists: '=lists'
      },
      templateUrl: 'social/item.html',
      link: function ($scope, $element, $attributes) {
        $scope.comment = '';

        $scope.commentInProgress = null;
        $scope.postInProgress = null;

        $scope.like = function (item) {
          SocialPostService.like(item.id)
            .success(function (data, status) {
              item.like = !item.like;
              var message = item.like ? 'Glad that you LOVE this Post!' : 'Did you not LOVE it?';
              MessageService.flush(message, 'success');
            })
            .error(function (data) {

            });
        };

        $scope.share = function (item) {
          if (item.dtype == 'eatery_post') {
            $scope.nativeShare('Check out this Eatery on Foodeebuddee - '+item.eatery.name+'\n', item.eatery.short_url);
          }
          else if (item.dtype == 'voucher_post') {
            $scope.nativeShare('Check out this deal on Foodeebuddee! \n', item.voucherCategory.short_url);
          }
        };

        $scope.nativeShare = function (msg, link) {
          $cordovaSocialSharing.share(msg, null, null, link)
            .then(function (result, status) {
              //MessageService.flush('Your shared this item', 'success');
            }, function (err) {
            });
        }

        /*$cordovaSocialSharing.share('test', null, null, 'http://www.nooz.gr')
         .then(function(result, status) {
         MessageService.flush('Your shared this item', 'success');
         }, function(err) {
         });*/

        $scope.updatedCommentContent = '';
        $scope.isEditComment = false;

        $scope.editComment = function (comment) {
          $scope.isEditComment = true;
          $scope.commentInProgress = comment.id;
          $scope.updatedCommentContent = comment.commentContent;
        };

        $scope.commentEditing = function (id) {
          return id == $scope.commentInProgress;
        };

        $scope.cancelEditComment = function () {
          $scope.commentInProgress = null;
          $scope.isEditComment = false;
        };

        $scope.updateComment = function (comment,content) {
          SocialPostService.updateComment($scope.commentInProgress, content)
            .success(function (data) {
              MessageService.flush('Your comment was edited successfully!', 'success');
              $scope.commentInProgress = null;
              $scope.isEditComment = false;
              comment.commentContent = content;
            })
            .error(function (data) {
              MessageService.flush('Something went wrong. Please try again later!', 'danger');
              $scope.commentInProgress = null;
            });
        };

        $scope.submitComment = function (item) {
          if ($scope.comment.trim() == '') {
            MessageService.flush('Your comment cannot be empty!', 'warning');
          }
          else {
            SocialPostService.comment(item.id, $scope.comment)
              .success(function (data, status) {
                // The api should return the comment entity so we can append it to the existing comments
                if (data.id === null || data.id === undefined) {
                  MessageService.flush('We could not process your request!', 'danger');
                } else {
                  item.postComments.splice(0, 0, data);
                  MessageService.flush('Thank you for your comment!', 'success');
                  $scope.comment = '';
                }
              })
              .error(function (error) {
                MessageService.flush('We could not process your request!', 'danger');
              });
          }
        };

        $scope.deleteComment = function (comment, post) {
            var message  = 'Are you sure you want to delete?';
            var buttonArray  = ['YES', 'NO'];
            $cordovaDialogs.confirm(message, buttonArray)
                .then(function(buttonIndex) {
                  if(buttonIndex == 1){
                      SharedState.toggle('modalPostCommentDelete');
                      SocialPostService.deleteComment(comment.id, post)
                        .success(function (data, status) {
                          var index = post.postComments.indexOf(comment);
                          post.postComments.splice(index, 1);
                          MessageService.flush('Your comment was deleted!', 'success');
                        })
                        .error(function (error) {
                        });
                    }
            });
        };

        $scope.likeComment = function (postComment) {
          SocialPostService.likeComment(postComment.id)
            .success(function (data, status) {
              postComment.like = !postComment.like;
              var message = postComment.like ? 'Glad that you LOVE this Comment!' : 'Did you not LOVE it?';
              MessageService.flush(message, 'success');
            })
            .error(function (data) {

            });
        };

        $scope.checkCommentOwner = function (comment, user) {
          return comment.userAccount.email == user.email;
        };

        //post editing

        $scope.updatedPostContent = '';
        $scope.isEditPost = false;

        $scope.checkPostOwner = function (post, user) {
          return post.userAccount.email == user.email;
        };

        $scope.editPost = function (post) {
          $scope.postInProgress = post.id;
          $scope.updatedPostContent = post.comments;
          $scope.isEditPost = true;
        };

        $scope.postEditing = function (id) {
          return id == $scope.postInProgress;
        };

        $scope.cancelEditPost = function () {
          $scope.postInProgress = null;
          $scope.isEditPost = false;
        };

        $scope.updatePost = function (item,comments) {
          SocialPostService.updatePost($scope.postInProgress, comments)
            .success(function (data) {
              MessageService.flush('Your post was edited successfully!', 'success');
              $scope.postInProgress = null;
              $scope.isEditPost = false;
              item.comments = comments;
            })
            .error(function (data) {
              MessageService.flush('Something went wrong. Please try again later!', 'danger');
              $scope.postInProgress = null;
            });
        };

        $scope.deletePost = function (post) {
            var message  = 'Are you sure you want to delete?';
            var buttonArray  = ['YES', 'NO'];
            $cordovaDialogs.confirm(message, buttonArray)
            .then(function(buttonIndex) {
              if(buttonIndex == 1){
                  SocialPostService.deletePost(post.id)
                    .success(function (data, status) {
                      if(data.message == 'success'){
                        var index = $scope.lists.indexOf(post);
                        $scope.lists.splice(index, 1);
                        MessageService.flush('Your post was deleted!', 'success');
                      }
                      else {
                        MessageService.flush('Something went wrong. Please try again later!', 'danger');
                      }
                    })
                    .error(function (error) {

                    });
                }
            });
        };

        $scope.viewEatery = function (id) {
          NavigatorService.setOverwrite('/social');
          NavigatorService.setCurrent('/eateries/'+id);
          $location.path('/eateries/'+id);
        };

        $scope.viewVoucher = function (id) {
          NavigatorService.setOverwrite('/social');
          NavigatorService.setCurrent('vouchers/view/'+id);
          $location.path('/vouchers/view/'+id);
        };
      }
    }

  });