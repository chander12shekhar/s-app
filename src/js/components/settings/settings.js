angular.module('FoodeeBuddee.services.Main', [])
  .factory('SettingsService', function (EnvConfig) {
    var self = {};

    // Basic App settings
    self.rest_url = EnvConfig.api;

    // Module toggling
    self.isRecipeModuleActive = true;


    // Social Networks Configuration

    // Google+
    self.googleClientId = '513337393147-bvlv8bdmmevhd6a4iqic0i90fumr20ms.apps.googleusercontent.com';
    self.googleClientSecret = 'Pkzw4NEQHBJiYQj78B_PkQP8';
    self.googleApiKey = 'AIzaSyDaiZ7rycUyIKOXL_evFogLB5mKgcm6Me4';

    // Facebook
    self.facebookAppId = '216211591859561'; // Santheman app id

    return self;
  });