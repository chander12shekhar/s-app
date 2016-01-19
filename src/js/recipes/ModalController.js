angular.module('FoodeeBuddee.controllers.ModalController', [])
    .controller('ModalController', function($scope, $location, $routeParams, $rootScope, ReceipeHelperService) {
        var self = this;
        self.messageTitle = 'Post Title';
        self.messageBody = 'Post Body';
        self.showMessage = function(title, msg) {
        	self.messageTitle = title? title : self.messageTitle;
        	self.messageBody = msg? msg : self.messageBody;
        	$rootScope.Ui.toggle('modalMessage');
        };
        $rootScope.$on('showMessage', function(e, argument) {
            self.showMessage(argument[0], argument[1]);
        });
    });