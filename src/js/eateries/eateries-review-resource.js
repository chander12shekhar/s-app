angular.module('FoodeeBuddee.resources.EateryReview', [])
  .factory('EateriesReviewResource', function ($resource, serverUrl, SettingsService) {

    var EateriesReviewResource = function(filter,id){
        var self = this;
        self.items = [];
        $resource(SettingsService.rest_url + '/api/v1/reviews/list/' + filter + '/'+ id)
        .query().$promise.then(function (items) {
            items.forEach(function (item) {
                self.items.push(item);
            });
        });
    }
    return EateriesReviewResource;
});
