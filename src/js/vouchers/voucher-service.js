angular.module('FoodeeBuddee.services.Voucher',[])
  .service('VoucherService', function(StorageService, $http, SettingsService) {

    var self = this;
    var vouchers = [];
    self.tab = 'all';
    self.currentVoucher = '';

    var initVouchers = function() {
      vouchers = StorageService.getItem('vouchers');
      if(vouchers === undefined || vouchers === null) {
        vouchers = [];
      }
    };

    initVouchers();

    self.addVoucher = function(voucher) {
      vouchers.push(voucher);
      StorageService.setItem('vouchers', vouchers);
    };

    self.redeem = function(voucher) {
      var req = {
        method: 'GET',
        url: SettingsService.rest_url + '/api/v1/voucher/redeem/' + voucher.id
      };
      return $http(req);
    };

    self.availableCities = function() {
      var req = {
        method: 'GET',
        url: SettingsService.rest_url + '/api/v1/vouchers/cities',
        cache: true
      };

      return $http(req);
    };

    self.merge = function(netVouchers) {
      angular.forEach(netVouchers, function(value, key) {
        angular.forEach(vouchers, function(localValue, localKey) {
          if(value.id === localValue.id) {
            netVouchers[key].code = localValue.code;
          }
        });

      });
      return netVouchers;
    };

    self.getVoucher = function(voucherId) {
      var req = {
        method: 'GET',
        url: SettingsService.rest_url + '/api/v1/voucher/view/' + voucherId
      };

      return $http(req);
    };

    self.remindMe = function(voucherId) {
      var req = {
        method: 'GET',
        url: SettingsService.rest_url + '/api/v1/voucher/remindMe/' + voucherId
      };
      return $http(req);
    };

    self.getSavings = function() {
      var req = {
        method: 'GET',
        url: SettingsService.rest_url + '/api/v1/voucher/getSavings/'
      };
      return $http(req);
    };

    return self;

  });
