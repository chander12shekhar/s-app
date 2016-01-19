angular.module('ingredientBuilderModule', [])
  .directive('ingredientBuilder', ['$compile', '$templateCache', function($compile, $templateCache) {
    return {
      restrict: 'E', // used E because of element
      scope: {
        data: '=',
        onTap: '&'

      },
      controller: function($scope, $element) {

        $scope.selectedItem = null;
        $scope.$on('$destroy', function() {
          console.log("$destroy");

        });
        $scope.init = function() {
        }
        $scope.init();
      },
      transclude: true,
      templateUrl: 'receipe/receipe-receipeIngredientsList.html',
      link: function(scope, element) {
        //$compile(element.contents())(scope);
      }
    };
  }]);