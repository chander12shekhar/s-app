angular.module('reviewDetailBuilderModule', [])
  .directive('reviewDetailBuilder', ['$compile', '$templateCache', function($compile, $templateCache) {
    return {
      restrict: 'E', // used E because of element
      scope: {
        data: '=',
        onTap: '&'
      },
      controller: function($scope, $element) {
        $scope.usersFoundHelpful = localeString.usersFoundHelpful;
        $scope.wasthisHelpful = localeString.wasthisHelpful;

        $scope.yesModelItem = {
          name: 'Yes',
          id: 'Yes',
          url: '#',
          iconClass: 'fa-thumbs-up'
        };

        $scope.noModelItem = {
          name: 'No',
          id: 'No',
          url: '#',
          iconClass: 'fa-thumbs-down'
        };
        $scope.editDetailModelItem = {
          name: 'Edit',
          id: 'EditReviewDetail',
          url: '#',
          iconClass: 'fa-pencil'
        };


        $scope.commentModelItem = {
          name: 'Comment',
          id: 'Comment',
          url: '#',
          iconClass: 'fa-comments'
        };

        $scope.deletecommentModelItem = {
          name: 'Delete',
          id: 'DeleteComment',
          url: '#',
          //iconClass: 'fa-times'
          iconClass: 'fa-trash-o'
        };
        $scope.editModelItem = {
          name: 'Edit',
          id: 'EditComment',
          url: '#',
          iconClass: 'fa-pencil'
        };


        $scope.comments = localeString.comments;
        $scope.selectedItem = null;
        $scope.record = null;
        $scope.$on('$destroy', function() {
          console.log("$destroy");

        });
        $scope.init = function() {
          $scope.record = $scope.data;
        }
        $scope.init();
      },
      transclude: true,
      templateUrl: 'receipe/receipe-reviewListDetail.html',
      link: function(scope, element, attr) {
        scope.itemSelected = function(record) {
          scope.selectedItem = record;
          scope.onTap({
            selectedItem: scope.selectedItem
          });
        };

      }

    };
  }]);