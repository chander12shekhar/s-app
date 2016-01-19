angular.module('FoodeeBuddee.services.Register', [])
    .service('RegisterService', function($http, SettingsService) {

        var self = this;

        self.addSpice = function(user) {
            var req = {
                url: SettingsService.rest_url + '/api/v1/user/update',
                method: 'POST',
                data: user
            };
            return $http(req);
        };

        self.updateMalInfo = function(user) {
            var req = {
                url: SettingsService.rest_url + '/api/v1/user/update-meal-info',
                method: 'POST',
                data: user
            };
            return $http(req);
        };

        self.verifyReferralCode = function(refcode) {
            var req = {
                url: SettingsService.rest_url + '/api/v1/user/verify-refcode/'+refcode,
                method: 'GET',
            };
            return $http(req);
        };
    });