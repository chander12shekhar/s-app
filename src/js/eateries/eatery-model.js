angular.module('FoodeeBuddee.factories.Eatery', [])
  .factory('EateryFactory', function() {

    var eateryFactory = function() {
      var eatery = this;

      eatery.name = '';
      eatery.address = {};
      eatery.aliasName = '';
      eatery.eateryType = [];
      eatery.subCuisines = [];
      eatery.cuisines = [];
      eatery.facilities = [];
      eatery.features = [];
      eatery.paymentOptions = [];
      eatery.famousDishes = [];
      eatery.mealTypes = [];
      eatery.menuType = '';
      eatery.eateryOptions = {'eateryAttire' : '', 'eateryAmbience' : '', 'eateryNoiseLevel' : '', 'eateryOthers' : '', 'eateryReservationRequired' : false};
      eatery.eateryDigitalContacts = {'eateryWebsite' : '', 'eateryFacebook' : '', 'eateryTwitter' : '', 'eateryPinterest' : ''};
      eatery.timingList = [];
      eatery.price = '';
      eatery.speciality = '';
    };
    return eateryFactory;
  });