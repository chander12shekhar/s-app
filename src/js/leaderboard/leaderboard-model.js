angular.module('FoodeeBuddee.models.LeaderBoard', [])
  .factory('LeaderBoardModel', function() {

    var leader = function() {
      var self = this;

      self.userAccount = {};
      self.buddees = [];
      self.reviewCount = 0;
      self.buddeeFBRanks = [];
      self.globalFBRanks = [];
      self.isAboveTenBuddee = false;
      self.isAboveTenGlobal = false;
      self.buddeeGroupFBRanks = {};
      self.ProgressPercentage = 0.0;
      self.buddeeGroupFBRanks = [];
      self.globalGroupFBRanks = [];
      self.groupAboveTenBuddee = false;
      self.allGroupAboveTenBuddee = false;
      self.groupGlobalRank = 0;
      self.groupBuddeRank = 0;
      self.userGlobalRank = 0;
      self.userBuddeeRank = 0;
      self.userPresentBadge='';
      self.userPresentLevel = 1;
      self.userTotalPoints = 100;
      self.lbPointsAdapters = [];

    };
    return leader;
  });