angular.module('reviewBuilderModule', [])
  .directive('reviewBuilder', ['$compile', '$templateCache', function($compile, $templateCache) {
    return {
      restrict: 'E', // used E because of element
      scope: {
        data: '=',
        onTap: '&'

      },
      controller: function($scope, $element) {
        $scope.selectedItem = null;

        $scope.shareModelItem = {
          name: 'Share',
          id: 'Share',
          url: '#',
          iconClass: 'fa-share-alt'
        };
        $scope.likeModelItem = {
          name: 'Yummy',
          id: 'Like',
          url: '#',
          iconClass: 'foodeebudee-yummy-icon',
          iconClassText: 'foodeebudee-yummy-icon-text'
        };


        $scope.$on('$destroy', function() {
          console.log("$destroy");

        });
        $scope.init = function() {

        }
        $scope.init();
      },
      transclude: true,


      templateUrl: 'receipe/receipe-reviewList.html',
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