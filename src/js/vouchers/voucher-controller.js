angular.module('FoodeeBuddee.controllers.VouchersList', [])
  .controller('VoucherController',
  function ($scope, ResourcesList, VoucherListResource, $routeParams, UserService, VoucherService, $sce,
            NavigatorService, SharedState, StorageService, MessageService, $cordovaSocialSharing, LocationService,
            SearchService, SubscriberService) {
    var self = this;

    NavigatorService.setCurrent('/vouchers/list/' + $routeParams.filter);
    NavigatorService.setPrevious('/vouchers/home');

    SearchService.hide = true;
    SubscriberService.publish('searchBar');

    SharedState.initialize($scope, 'activeTab');
    SharedState.initialize($scope, 'activePotentialSaving');
    SharedState.set('activeTab', 1);
    SharedState.set('activePotentialSaving', 1);
    self.voucher = {};
    self.busy = false;
    self.voucherId = $routeParams.id;
    self.voucherCity = {id: -1, name: 'all'};
    self.voucherList = {};
    self.filter = $routeParams.slug;
    self.selectedTab = self.filter;
    self.logged = StorageService.getBoolean('logged');
    self.tab = '';
    self.baseUrl = 'https://www.foodeebuddee.com';
    self.city = {id: '', name: ''};

    angular.element(document).ready(function () {
      $('.scrollable-header').each(function() {
        var self = this;
        var active = $('li.ng-scope.active');
        active = $(active[0]);
        if(active.offset() !== undefined) $(self).animate({scrollLeft: active.offset().left}, 800, 'swing');
      });
    });

    LocationService.currentLocation()
      .then(function(result) {
        LocationService.getLocationDetails(result.coords.latitude, result.coords.longitude);
      });

    var mapping = [];
    mapping['all'] = { tab: 1, scroll: true };
    mapping['my'] = { tab: 2, scroll: true };
    mapping['recommended'] = { tab: 3, scroll: false };
    mapping['unused'] = { tab: 4, scroll: true };
    mapping['missed'] = { tab: 5, scroll: true };
    mapping['saving'] = { tab: 6, scroll: true };

    if(self.filter !== undefined) {
      $scope.activeTab = mapping[self.filter].tab;
    }

    if(self.filter !== undefined) {
      SharedState.set('activeTab', mapping[self.filter].tab);
      self.cities = VoucherService.availableCities()
        .success(function (data) {
          setTimeout(function() {
            self.voucherCity = data[0];
            for(i=0; i< data.length; i++) {
              if(LocationService.cityVal.trim() === 'Bengaluru' || LocationService.cityVal.trim() === '') {
                if((data[i].name == 'Bangalore')) {
                  self.voucherCity = data[i];
                }
              }
              else if((LocationService.cityVal == 'Chennai') && (data[i].name == 'Chennai')) {
                self.voucherCity = data[i];
              }
            }
            self.city = self.voucherCity;
            self.cities = data;
            self.voucherCity = self.filter == 'all' ? self.voucherCity : null;
            self.voucherList = new ResourcesList(new VoucherListResource(self.filter, self.voucherCity));
            VoucherService.tab = self.filter;
//          NavigatorService.setPrevious('/vouchers/list/' + VoucherService.tab);
            self.voucherList.setCallback(function (list) {
                VoucherService.merge(self.voucherList.items);
              }
            );
            if(mapping[self.filter].scroll == false) {
              self.voucherList.nextPage();
            }
          } ,1000);
        })
        .error(function (data) {
          self.voucherList = new ResourcesList(new VoucherListResource(self.filter, self.voucherCity));
          // proper error handling
          if(mapping[self.filter].scroll == false) {
            self.voucherList.nextPage();
          }
        });
    }


    if (self.voucherId !== undefined) {
      self.busy = true;
      VoucherService.currentVoucher = self.voucherId;
      NavigatorService.setCurrent('/vouchers/view/' + self.voucherId);
      NavigatorService.setPrevious('/vouchers/list/' + VoucherService.tab);
      VoucherService.getVoucher(self.voucherId)
        .success(function (data) {
          self.voucher = data;
          self.replaceVoucherLinks();
          self.voucher.description = $sce.trustAsHtml(self.voucher.description);
          self.busy = false;
        })
        .error(function (data) {
          // Proper error handling
        });
    }


    self.updateList = function (city) {
      self.voucherList = new ResourcesList(new VoucherListResource(self.filter, city));
      self.voucherList.nextPage();
    };

    self.loggedIn = UserService.isLogged();

    self.redeem = function () {
      if(self.logged == true) {
        self.busy = true;
        VoucherService.redeem(self.voucher)
          .success(function(data) {
            self.voucher.code = data;
            self.voucher.user_voucher = {};
            self.voucher.user_voucher.voucherCode = data;
            VoucherService.addVoucher(self.voucher);
            self.busy = false;
          })
          .error(function(data) {
            self.busy = false;
          });
      }
      else {
        MessageService.flush('Please SIGN IN to get Voucher Code!', 'warning', null, null);
      }
    };

    self.isRedeemed = function (voucher) {
      if (voucher.user_voucher != undefined) {
        var code = voucher.user_voucher.voucherCode;
        return (code !== undefined && code !== null);
      } else {
        return false;
      }
    };

    self.tabMenuSelected = function (filter) {
      var currentFilter = SharedState.get('activeTab');
      if(currentFilter != mapping[filter].tab) {
        VoucherService.tab = filter;
        NavigatorService.setCurrent('/vouchers/list/' + filter);
        NavigatorService.setPrevious('/vouchers/home');
        self.selectedTab = filter;
        self.filter = filter;
        self.voucherCity = filter == 'all' ? self.city : null;
        self.voucherList = new ResourcesList(new VoucherListResource(self.filter, self.voucherCity));
        if(mapping[self.filter].scroll == false) {
          self.voucherList.nextPage();
        }
      }
    };

    self.savings = {};
    self.getSavings = function() {
      self.busy = true;
      VoucherService.getSavings()
        .success(function(data) {
          self.savings = data;
          self.busy = false;
        })
        .error(function(data) {
          MessageService.flush('Something went wrong. Please try again later!', 'error', null, null);
          self.busy = false;
        });
    };

    if(self.filter == 'saving'){
      self.getSavings();
    }

    self.savingsAction = function () {
      MessageService.flush('Coming soon!', 'warning', null, null);
    };

    self.remindMe = function(voucher) {
      self.busy = true;
      VoucherService.remindMe(voucher.id)
        .success(function(data) {
          self.busy = false;
          voucher.reminded = true;
          MessageService.flush('We will remind you once this voucher is back!', 'warning', null, null);
        })
        .error(function(data) {
          self.busy = false;
          MessageService.flush('Something went wrong. Please try again later!', 'error', null, null);
        });
    };

    self.shareVoucher = function (shortUrl) {
      $cordovaSocialSharing
        .share("Check out this deal on Foodeebuddee! \n", null, null, shortUrl)
        .then(function(result) {
          //
        }, function(err) {
          MessageService.flush('Something went wrong with the sharing', 'warning');
        });
    };

    self.replaceVoucherLinks = function() {

      // TODO Note: This should be only one link practically. I have added all possible links as of now for santheman.com and foodeebuddee.com also

      self.voucher.description = self.voucher.description.replace(/https:\/\/www.santheman.com\/eatery/g, "#/eateries");
      self.voucher.description = self.voucher.description.replace(/http:\/\/www.santheman.com\/eatery/g, "#/eateries");
      self.voucher.description = self.voucher.description.replace(/http:\/\/santheman.com\/eatery/g, "#/eateries");
      self.voucher.description = self.voucher.description.replace(/https:\/\/www.foodeebuddee.com\/eatery/g, "#/eateries");
      self.voucher.description = self.voucher.description.replace(/http:\/\/www.foodeebuddee.com\/eatery/g, "#/eateries");
      self.voucher.description = self.voucher.description.replace(/http:\/\/foodeebuddee.com\/eatery/g, "#/eateries");
      self.voucher.description = self.voucher.description.replace(/target="_blank"/g, "");
    };

    self.notLogged = function() {
      MessageService.flush('Please SIGN IN to view!', 'warning');
    };

  });