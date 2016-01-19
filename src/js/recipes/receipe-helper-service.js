angular.module('FoodeeBuddee.receipe.helper', [])
  .service('ReceipeHelperService', function($http, SettingsService) {

    var self = this;
    self.timeout = 80000;
    self.base_url = "/api/v1/recipes";
    self.mode = 'development',
      self.developmentUrl = SettingsService.rest_url,
      self.localUrl = 'stubs',
      self.productionUrl = SettingsService.rest_url,

      self.urlConfiguration = {
        development: {
          getAdvanceRating: self.developmentUrl + self.base_url + '/getAdvanceRating',
          submitRating: self.developmentUrl + self.base_url + '/submitRating/{param}',
          receipeCreate: self.developmentUrl + self.base_url + '/create',
          deleteComment: self.developmentUrl + self.base_url + '/deleteComment',
          addComment: self.developmentUrl + self.base_url + '/addComment',
          updateComment: self.developmentUrl + self.base_url + '/updateComment/{param}',
          likeComment: self.developmentUrl + self.base_url + '/likeComment/{param}',
          isUsefullReview: self.developmentUrl + self.base_url + '/isUsefullReview',
          likeReceipe: self.developmentUrl + self.base_url + '/likeReceipe/{param}',
          yummyReceipe: self.developmentUrl + self.base_url + '/yummyReceipe/{param}',
          reviewCreate: self.developmentUrl + self.base_url + '/reviewCreate',
          advancereviewCreate: self.developmentUrl + self.base_url + '/advancereviewCreate',
          getBasicRating: self.developmentUrl + self.base_url + '/getBaseRating',
          submitReceipeBasicRating: self.developmentUrl + self.base_url + '/submitBasicRating',
          getRecipeall: self.developmentUrl + self.base_url + '/all',
          getRecipeFavourite: self.developmentUrl + self.base_url + '/favorite/{param}',
          getRecipeRecommended: self.developmentUrl + self.base_url + '/recommended/{param}',
          getMyRecipe: self.developmentUrl + self.base_url + '/myrecipe/{param}',
          applyFilterOnRecipe: self.developmentUrl + self.base_url + '/filteredRecipe',
          getReviewDetails: self.developmentUrl + self.base_url + '/getReviewDetails',
          getComment: self.developmentUrl + self.base_url + '/getComment/{param}',
        },
        production: {
          getAdvanceRating: self.productionUrl + self.base_url + '/getAdvanceRating',
          submitRating: self.productionUrl + self.base_url + '/submitRating/{param}',
          receipeCreate: self.productionUrl + self.base_url + '/create',
          deleteComment: self.productionUrl + self.base_url + '/deleteComment',
          addComment: self.productionUrl + self.base_url + '/addComment',
          updateComment: self.productionUrl + self.base_url + '/updateComment/{param}',
          likeComment: self.productionUrl + self.base_url + '/likeComment/{param}',
          isUsefullReview: self.productionUrl + self.base_url + '/isUsefullReview',
          likeReceipe: self.productionUrl + self.base_url + '/likeReceipe/{param}',
          yummyReceipe: self.productionUrl + self.base_url + '/yummyReceipe/{param}',
          reviewCreate: self.productionUrl + self.base_url + '/reviewCreate',
          advancereviewCreate: self.productionUrl + self.base_url + '/advancereviewCreate',
          getBasicRating: self.productionUrl + self.base_url + '/getBasicRating',
          submitReceipeBasicRating: self.productionUrl + self.base_url + '/submitBasicRating',
          getRecipeall: self.productionUrl + self.base_url + '/all',
          getRecipeFavourite: self.productionUrl + self.base_url + '/favorite/{param}',
          getRecipeRecommended: self.productionUrl + self.base_url + '/recommended/{param}',
          getMyRecipe: self.productionUrl + self.base_url + '/myrecipe/{param}',
          applyFilterOnRecipe: self.productionUrl + self.base_url + '/filteredRecipe',
          getReviewDetails: self.productionUrl + self.base_url + '/getReviewDetails',
          getComment: self.productionUrl + self.base_url + '/getComment/{param}',
        }

      };
    self.getPacket = function(url, method, data) {

      var request = {};

      var realUrl = self.urlConfiguration[self.mode][url];

      //Need to Customize for get with parameters.
      if (method === 'GET') {
        if (url == 'getRating') {
          realUrl = realUrl.replace('param', data);
        } else {
          realUrl = realUrl.replace('{param}', data);
        }

        request = {
          url: realUrl,
          method: method,
          timeout: self.timeout,
          cache: true

        };

      } else if (method === 'POST') {

        realUrl = realUrl.replace('{param}', data);

        if (url == 'yummyReceipe') {
          realUrl = realUrl.replace('{param}', data);
          request = {
            method: 'POST',
            url: realUrl,
            timeout: self.timeout,
            cache: true
          };

        } else {
          request = {
            method: 'POST',
            url: realUrl,
            data: data,
            timeout: self.timeout,
            cache: true
          };

        }

        if (!data) {
          delete request.data;
        }
      }

      return request;
    };
    self.getUrl = function(url) {
      var realUrl = self.urlConfiguration[mode][url];
      return realUrl;
    };

    //Start
    self.getRecipeall = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getRecipeall', 'GET', data);
      return $http(request);
    };
    self.getRecipeFavourite = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getRecipeFavourite', 'GET', data);
      return $http(request);
    };
    self.getRecipeRecommended = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getRecipeRecommended', 'GET', data);
      return $http(request);
    };
    self.getMyRecipe = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getMyRecipe', 'GET', data);
      return $http(request);
    };

    //End

    self.getReceipeBasicRating = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getBasicRating', 'GET', data);
      return $http(request);
    };
    self.submitReceipeBasicRating = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('submitReceipeBasicRating', 'POST', data);
      return $http(request);
    };

    self.getReceipeAdvanceRating = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getAdvanceRating', 'GET', data);
      return $http(request);
    };
    self.submitReceipeRating = function(data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('submitRating', 'POST', data);
      return $http(request);
    };
    self.isUsefulYummyReceipe = function(data) {
      var request = self.getPacket('isUsefullReview', 'POST', data);
      return $http(request);
    };
    self.addYummyReceipe = function(data) {
      var request = self.getPacket('yummyReceipe', 'POST', data);
      return $http(request);
    };
    self.addlikeReceipe = function(data) {
      var request = self.getPacket('likeReceipe', 'POST', data);
      return $http(request);
    };
    self.addComment = function(data) {

      var request = self.getPacket('addComment', 'POST', data);
      return $http(request);
    };
    self.updateComment = function(data) {

      var request = self.getPacket('updateComment', 'POST', data);
      return $http(request);
    };

    self.deleteComment = function(data) {


      var request = self.getPacket('deleteComment', 'delete', data);
      return $http(request);
    };
    self.likeComment = function(data) {

      var request = self.getPacket('likeComment', 'POST', data);
      return $http(request);
    };


    self.createReceipe = function(receipe, rawImage) {
      var receipeAdapter = {};
      receipeAdapter.receipe = receipe;
      receipeAdapter.image = rawImage;

      var request = self.getPacket('receipeCreate', 'POST', receipeAdapter);
      return $http(request);
    };

    self.basicreviewCreate = function(data) {
      var request = self.getPacket('reviewCreate', 'POST', data);
      return $http(request);
    };
    self.advanceReviewCreate = function(data) {
      var request = self.getPacket('advancereviewCreate', 'POST', data);
      return $http(request);
    };
    self.applyFilterRecipe = function(data) {
      var request = self.getPacket('applyFilterOnRecipe', 'GET', data);
      return $http(request);
    };

    self.getReviewDetails = function(data) {
      var request = self.getPacket('getReviewDetails', 'GET', data);
      return $http(request);
    };

    self.getComment=function(data){

    var request=self.getPacket('getComment','GET',data);
    return $http(request);
    };

    return self;

  });