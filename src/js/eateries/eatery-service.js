angular.module('FoodeeBuddee.services.Eatery', [])
  .service('EateryService', function ($http, SettingsService, MessageService) {

    var self = this;

    self.favourite = function(eatery) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/eateries/favourite/' + eatery.id
      };
      $http(req)
        .success(function(data) {
          if(data.message == 'success'){
            MessageService.flush('You marked this Eatery as your Favourite!', 'success');
          }
          else{
            MessageService.flush('We could not process your request. Please try again later!', 'warning');
          }
        })
        .error(function(data) {
          MessageService.flush('We could not process your request. Please try again later!', 'danger');
        });
    };

    self.like = function(eatery) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/eateries/like/' + eatery.id
      };
      $http(req)
        .success(function(data) {
          if(data.message == 'liked'){
            MessageService.flush('Awesome to know, you LOVE this Eatery!', 'success');
          }else{
            MessageService.flush('Oh No! We thought you loved this Eatery!', 'success');
          }
        })
        .error(function(data) {
          MessageService.flush('We could not process your request. Please try again later!', 'danger');
        });
    };

    self.generateShortUrl = function(id,aliasName){
      var longUrl = SettingsService.rest_url + '/eatery/' + aliasName;
      gapi.client.setApiKey('AIzaSyBhYxRJflds1A4HMqM2NzALwr-gxjAdmXk');
      gapi.client.load('urlshortener', 'v1');
      if( typeof gapi.client != 'undefined'){
          var interval = setInterval(function() {
              gapi.client.urlshortener.url.insert({
                  'longUrl': longUrl
              }).then(function(response) {
                var req = {
                    method: 'POST',
                    url: SettingsService.rest_url + '/api/v1/eateries/storeUrl/' + id,
                    data : {url : response.result.id}
                  };
                  $http(req)
                    .success(function(data){})
                    .error(function(data) {});
              });
              clearInterval(interval);
          },500);
      }
    }

    return self;

  });