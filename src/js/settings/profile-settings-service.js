angular.module('FoodeeBuddee.services.ProfileSettingsService', [])
    .service('ProfileSettingsService', function($http, SettingsService) {

        var self = this;

        self.savePrivacySettings = function(user) {
            console.log(user);
            var req = {
                url: SettingsService.rest_url + '/api/v1/user/update-privacy-settings',
                method: 'POST',
                data: user
            };
            return $http(req);
        };

        self.saveUserProfile = function(user) {
            console.log(user);
            console.log("saveUserProfile");
            var req = {
                url: SettingsService.rest_url + '/api/v1/user/update-profile-settings',
                method: 'POST',
                data: user
            };
            return $http(req);
        };

        self.saveUserAddress = function(user) {
            console.log(user);
            console.log("saveUserAddress");
            var req = {
                url: SettingsService.rest_url + '/api/v1/user/update-address-settings',
                method: 'POST',
                data: user
            };
            return $http(req);
        };

        self.saveUserOrigin = function(user) {
            console.log(user);
            console.log("saveUserOrigin");
            var req = {
                url: SettingsService.rest_url + '/api/v1/user/update-origin-settings',
                method: 'POST',
                data: user
            };
            return $http(req);
        };
    });