angular.module('FoodeeBuddee.controllers.EateriesRating', [])
  .controller('EateriesRatingController', function (SharedState, EateryRatingFactory, $routeParams, NavigatorService,EateryHelperService,MessageService,$location,EateriesResource,$scope, SearchService, SubscriberService, StorageService) {
    var self = this;
    self.busy= true;
    self.logged = StorageService.getBoolean('logged');
    if(!self.logged){
        $location.path('/login');
        MessageService.flush('Please SIGN IN for further actions !', 'warning', null, null);
    }

    SharedState.initialize($scope, 'activeTab');
    SharedState.initialize($scope, 'modalAdvRate');
    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    var eateryId = $routeParams.id;

    self.filter = 'dinein';

    EateriesResource.get({
        id: $routeParams.id
    }).$promise
    .then(function (eatery) {
        NavigatorService.setCurrent('/eateries/rating/' + $routeParams.id);
        NavigatorService.setPrevious('/eateries/' + $routeParams.id);
        $scope.eatery = eatery;
        if(eatery.eateryDineIn) {
            SharedState.set('activeTab', 1);
            self.filter = 'dinein';
        }
        else if(eatery.eateryHomeDelivery){
            SharedState.set('activeTab', 2);
            self.filter = 'homedelivery';
        }
        else if(eatery.eateryPickUp){
            SharedState.set('activeTab', 3);
            self.filter = 'pickup';
        }
        self.busy= false;
    });

    NavigatorService.setCurrent('/eateries/advanceRating/' + eateryId);
    self.eateryRating = new EateryRatingFactory();

    self.rate = function() {
        if(self.validateRating(self.eateryRating,self.filter)){
            self.busy= true;
            EateryHelperService.submitAdvancedRate(eateryId, self.eateryRating)
            .success(function(result) {
              MessageService.flush('Thank you for Rating!', 'success');
              $location.path('/eateries/rating/'+eateryId);
            })
            .error(function(result) {
              MessageService.flush('Something went wrong. Please try again later!', 'failure');
            });
      }
    };



    self.submitSimpleRate = function () {
      if(self.simpleRateValue != 0 ){
        self.busy = true;
        EateryHelperService.submitSimpleRate($scope.eatery.id, self.simpleRateValue)
          .success(function(data) {
            if (data.id === null || data.id === undefined) {
                MessageService.flush('We could not process your request!', 'danger');
            }
            else {
                $scope.eatery.eateryRatings.splice(0, 0, data);
                MessageService.flush('Thank you for Rating!', 'success');
                self.busy = false;
                $scope.eatery.simpleRating = true;
            }
          })
          .error(function(result) {
            self.busy = false;
          });
      }
      else{
        MessageService.flush('Give minimum 1 star', 'failure');
      }
    };

    self.validateRating = function(eateryRating,filter){
        var validate = true;
        if(filter == 'dinein'){
            eateryRating.dineInMenu.forEach(function (item) {
                item.items.forEach(function (item) {
                    if(item.rating == 0) validate = false;
                });
            });
            if(!validate) MessageService.flush('Please rate all dine in attributes!', 'failure');
        }
        if(filter == 'homedelivery' ){
            eateryRating.deliveryMenu.forEach(function (item) {
                item.items.forEach(function (innerItem) {
                    if(innerItem.rating == 0 && item.header == 'Home Delivery') validate = false;
                });
            });
            if(!validate) MessageService.flush('Please rate all home delivery attributes!', 'failure');
        }
        if(filter == 'pickup' ){
            eateryRating.deliveryMenu.forEach(function (item) {
                item.items.forEach(function (innerItem) {
                    if(innerItem.rating == 0 && item.header == 'Pick Up') validate = false;
                });
            });
            if(!validate) MessageService.flush('Please rate all pick up attributes!', 'failure');
        }
        if(validate){
            validate = self.validateOtherTabRatings(eateryRating,filter);
        }
        return validate;
    };

    self.validateOtherTabRatings = function(eateryRating,filter){
        var validate = true;
        if(filter == 'dinein'){
            if($scope.eatery.eateryHomeDelivery){
                eateryRating.deliveryMenu.forEach(function (item) {
                    var count = 0;
                    item.items.forEach(function (innerItem) {
                        if(innerItem.rating != 0 && item.header == 'Home Delivery') count++;
                    });
                    if(count > 0 && count < 9) validate = false;
                });
                if(!validate){
                    MessageService.flush('Please rate all home delivery attributes!', 'warning');
                    return validate;
                }
            }
            if ($scope.eatery.eateryPickUp){
                eateryRating.deliveryMenu.forEach(function (item) {
                    var count = 0;
                    item.items.forEach(function (innerItem) {
                        if(innerItem.rating != 0 && item.header == 'Pick Up') count++;
                    });
                    if(count > 0 && count < 8) validate = false;
                });
                if(!validate){
                    MessageService.flush('Please rate all pick up attributes!', 'warning');
                    return validate;
                }
            }
        }
        else if(filter == 'homedelivery'){
            if($scope.eatery.eateryDineIn){
                var count = 0;
                eateryRating.dineInMenu.forEach(function (item) {
                    item.items.forEach(function (item) {
                        if(item.rating != 0) count++;
                    });
                });
                if(count > 0 && count < 10) validate = false;
                if(!validate){
                    MessageService.flush('Please rate all dine in attributes!', 'warning');
                    return validate;
                }
            }
            if ($scope.eatery.eateryPickUp){
                eateryRating.deliveryMenu.forEach(function (item) {
                    var count = 0;
                    item.items.forEach(function (innerItem) {
                        if(innerItem.rating != 0 && item.header == 'Pick Up') count++;
                    });
                    if(count > 0 && count < 8) validate = false;
                });
                if(!validate){
                    MessageService.flush('Please rate all pick up attributes!', 'warning');
                    return validate;
                }
            }
        }
        else if(filter == 'pickup'){
            if($scope.eatery.eateryDineIn){
                var count = 0;
                eateryRating.dineInMenu.forEach(function (item) {
                    item.items.forEach(function (item) {
                        if(item.rating != 0) count++;
                    });
                });
                if(count > 0 && count < 10) validate = false;
                if(!validate){
                    MessageService.flush('Please rate all dine in attributes!', 'warning');
                    return validate;
                }
            }
            if($scope.eatery.eateryHomeDelivery){
                eateryRating.deliveryMenu.forEach(function (item) {
                    var count = 0;
                    item.items.forEach(function (innerItem) {
                        if(innerItem.rating != 0 && item.header == 'Home Delivery') count++;
                    });
                    if(count > 0 && count < 9) validate = false;
                });
                if(!validate){
                    MessageService.flush('Please rate all home delivery attributes!', 'warning');
                    return validate;
                }
            }
        }
        return validate;
    }

    self.clearRatings = function(eateryRating,filter){
        if(filter == 'dinein'){
            eateryRating.dineInMenu.forEach(function (item) {
                item.items.forEach(function (innerItem) {
                    innerItem.rating = 0;
                });
            });
        }
        else if(filter == 'homedelivery' ){
            eateryRating.deliveryMenu.forEach(function (item) {
                item.items.forEach(function (innerItem) {
                    if(item.header == 'Home Delivery') innerItem.rating = 0;
                });
            });
        }
        else if(filter == 'pickup' ){
            eateryRating.deliveryMenu.forEach(function (item) {
                item.items.forEach(function (innerItem) {
                    if(item.header == 'Pick Up') innerItem.rating = 0;
                });
            });
        }
    };

    self.tabMenuSelected = function(filter){
        self.filter = filter;
    };

    self.giveAdvanceRating = function() {
      NavigatorService.setOverwrite('/eateries/rating/' + $routeParams.id);
      NavigatorService.setCurrent('/eateries/ratings/' + $routeParams.id);
      $location.path('/eateries/ratings/'+eateryId);
    };
    self.giveSimpleReview = function() {
      NavigatorService.setOverwrite('/eateries/rating/' + $routeParams.id);
      NavigatorService.setCurrent('/eateries/review/' + $routeParams.id);
      $location.path('/eateries/review/'+eateryId);
    };
    self.giveSimpleRate = function() {
      $location.path('/eateries/rating/'+eateryId);
    }

    self.advRating = {};

    self.showAdvRating = function(rating) {
      self.advRating = rating;
      SharedState.toggle('modalAdvRate');
    }

  });