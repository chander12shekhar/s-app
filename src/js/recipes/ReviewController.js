angular.module('FoodeeBuddee.controllers.Review', [])
    .controller('ReviewController', function($scope, $location, $routeParams, CameraService, ReceipeHelperService) {
        var self = this;
        self.isAdvancedReview = false;
        self.review = {
            body: '',
            thumbImagePath: null
        };
        self.enableAdvancedReview = function() {
            self.isAdvancedReview = true;
        };
        self.takePicture = function() {
            CameraService.setElement('review-image');
            CameraService.capture();
        };
        self.submitReview = function(reviewType) {
            var data = {};
            
            if (ReceipeHelperService) {
                var reviewPostAction = self.isAdvancedReview ? ReceipeHelperService.advanceReviewCreate : ReceipeHelperService.basicreviewCreate;
                reviewPostAction(data).success(function(response) {
                    console.log("submitReceipeRating success response");
                    console.log(response);
                    //Assuming that the create review API returns a review unique id.
                    if(!response && !response.reviewId){
                    	response.reviewId = 40;
                    }else{
                    	$routeParams.rootId = response.reviewId;
                    }
                    //response.reviewId
                    $location.url('/recipes/advancedReview/' + $routeParams.id);
                }).error(function(response) {
                    console.log(" submitReceipeRating  failure response");
                    console.log(response);
                    //Assuming that the create review API returns a review unique id.
                    if(!response || !response.reviewId){
                    	response.reviewId = 40;
                    }else{
                    	$routeParams.rootId = response.reviewId;
                    }
                    $location.url('/recipes/advancedReview/' + $routeParams.id);
                });
            }
        };
        self.goBackHome=function()
        {
            console.log("go back home");

            $location.url('/recipes/'+$routeParams.id); 

        };


        self.advanceReview = {
            title: "Title of the advanced Review",
            date: "10:11 - 08/08/2015",
            reviewContent: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            username: "User Name",
            overallRating: 4,
            reviewTitleContent: "Review all recipes"
        };

        //Create a footer model to handle the footer items for the view.
        //Wiring tested with -> "#/eateries/advanceRating/'+$routeParams.id
        $scope.footerModel = [{
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

        $scope.reviewLaunch = function(footerModel) {
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
            };
    });