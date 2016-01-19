

angular.module('reviewRatingBuilderModule', [])
  .directive('reviewRating', ['$compile', '$templateCache', function($compile, $templateCache) {
    return {
      restrict: 'E', // used E because of element
      scope: {
        data: '=',
        onTap: '&'

      },
      controller: function($scope, $element) {
        $scope.usersFoundHelpful = localeString.usersFoundHelpful;
        $scope.comments = localeString.comments;
        $scope.selectedItem = null;
        $scope.isReadonly=false;

        $scope.$on('$destroy', function() {
          console.log("$destroy");

        });
        $scope.init = function() {
        }
        $scope.init();
      },
      transclude: true,
      templateUrl: 'receipe/receipe-advancerating.html',
      link: function(scope, element, attr) {
        scope.itemSelected = function(record) {
          scope.selectedItem = record;
          scope.onTap({
            selectedItem: scope.selectedItem
          });
        };

         scope.rateFunction = function(rating,menu,subMenu) {
         console.log("Rating selected: " , rating);
         console.log("Rating menu selected: " , menu);
          console.log("Rating subMenu selected: " , subMenu);


       };

      }

    };
  }]);