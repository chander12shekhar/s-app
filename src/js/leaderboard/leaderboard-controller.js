angular.module('FoodeeBuddee.controllers.Leaderboard',[])
  .controller('LeaderBoardController',
    function($scope, StorageService, LeaderBoardService, LeaderBoardModel, MessageService, SharedState, NavigatorService, $interval,
             $filter, $cacheFactory, SearchService, SubscriberService, $location) {
      NavigatorService.setCurrent('/leaderboard/me');
      NavigatorService.setPrevious('/');

      SharedState.initialize($scope, "activeTab", 1);
      SharedState.initialize($scope, "activeBadgeTab", 1);
      SharedState.initialize($scope, "activeRankTab", 1);
      SharedState.initialize($scope, "activeGlobalRankTab", 1);
      SharedState.set("activeTab", 1);
      SharedState.set("activeBadgeTab", 1);
      SharedState.set("activeRankTab", 1);
      SharedState.set("activeGlobalRankTab", 1);

      SearchService.hide = true;
      SubscriberService.publish('searchBar');

      var self = this;
      self.logged = StorageService.getBoolean('logged');
      if(!self.logged){
          $location.path('/login');
          MessageService.flush('Please SIGN IN for further actions !', 'warning', null, null);
      }
      self.leader = '';
      self.model = new LeaderBoardModel();
      self.leader = self.model;
      self.busy = true;
      self.mainTabBusy = true;
      self.badgeTabBusy = true;
      self.maps = [];
      self.maps['JOINED_BONUS'] = 'Joining Bonus';
      self.maps['EATERY'] = 'Eateries';
      self.maps['RECIPE'] = 'Recipes';
      self.maps['BRAND'] = 'My Brands';
      self.maps['BUDDEE'] = 'My Buddees';
      self.maps['BUDDEE_REFERRAL'] = 'Referrals';
      self.maps['SIMPLE_REVIEW'] = 'My Reviews';
      self.maps['BLOG'] = 'Advance Reviews';
      self.maps['USERS_VOUCHER'] = 'Vouchers';
      self.maps['IMAGE'] = 'Images';

      self.badgeType = '';

      LeaderBoardService.getLeaderBoard('me')
        .success(function(data) {
          self.leader = data;
          self.busy = false;
          self.mainTabBusy = false;
          self.badgeTabBusy = false;
        })
        .error(function(error) {
          MessageService.flush("Cannot load your Leaderboard data", "warning");
          LeaderBoardService.clearCache();
          self.busy = false;
        });

      self.profileImage = StorageService.getItem('profileImage');
      self.account = StorageService.getItem('user');

      self.fetchBadges = function(type){
        self.badgeTabBusy = true;
        self.badgeType = type;
        LeaderBoardService.fetchBadges(type)
          .success(function(data) {
            self.leader.lbUserBadges = data;
            self.badgeTabBusy = false;
          })
          .error(function(error) {
            MessageService.flush("Cannot load your Leaderboard data", "warning");
            self.badgeTabBusy = false;
          });
      };


      self.fetchLB = function(type){
        self.mainTabBusy = true;
        LeaderBoardService.getLeaderBoard(type)
          .success(function(data) {
            if(type == 'me'){
                self.leader.lbPointsAdapters = data.lbPointsAdapters;
            }
            else if(type == 'buddees'){
                SharedState.set("activeRankTab", 1);
                self.leader.buddeeFBRanks = data.buddeeFBRanks;
                self.leader.globalFBRanks = data.globalFBRanks;
                self.leader.isAboveTenBuddee = data.isAboveTenBuddee;
                self.leader.isAboveTenGlobal = data.isAboveTenGlobal;
            }
            else if(type == 'groups'){
                SharedState.set("activeGlobalRankTab", 1);
                self.leader.buddeeGroupFBRanks = data.buddeeGroupFBRanks;
                self.leader.globalGroupFBRanks = data.globalGroupFBRanks;
                self.leader.userActiveGroup = data.userActiveGroup;
                self.leader.groupBuddeRank = data.groupBuddeRank;
                self.leader.groupGlobalRank = data.groupGlobalRank;
                self.leader.groupAboveTenBuddee = data.groupAboveTenBuddee;
                self.leader.allGroupAboveTenBuddee = data.allGroupAboveTenBuddee;
            }
            else if(type == 'badges'){
                SharedState.set("activeBadgeTab", 1);
                self.leader.lbUserBadges = data.lbUserBadges;
            }
            self.mainTabBusy = false;
          })
          .error(function(error) {
            MessageService.flush("Cannot load your Leaderboard data", "warning");
            self.mainTabBusy = false;
          });
      };

      self.createEatery = function() {
        NavigatorService.setOverwrite('/leaderboard/me');
        $location.path('/eatery/new');
      };

      self.viewAllEateries = function() {
        NavigatorService.setOverwrite('/leaderboard/me');
        $location.path('/eateries/list/all');
      };

  });