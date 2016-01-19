angular.module('yummyfavoriteBuilderModule', [])
  .directive('yummyfavoriteBuilder', ['$compile', '$templateCache', function($compile, $templateCache) {
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
      templateUrl: 'receipe/yummy-favorite-component.html',
      link: function(scope, element) {
        //$compile(element.contents())(scope);
      }
    };
  }]);