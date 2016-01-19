angular.module('preparationProcessBuilderModule', [])
  .directive('preparationprocessBuilder', ['$compile', '$templateCache', function($compile, $templateCache) {
    return {
      restrict: 'E', // used E because of element
      scope: {
        data: '=',
      },
      controller: function($scope, $element) {
        $scope.selectedItem = null;
        $scope.step = localeString.step;
        $scope.$on('$destroy', function() {
          console.log("$destroy");
        });
        $scope.init = function() {
        }
        $scope.init();


      },
      transclude: true,
      templateUrl: 'receipe/receipe-preparationProcessList.html',
      link: function(scope, element) {
        //$compile(element.contents())(scope);

        scope.itemPreparationProcessSelected = function(record) {

          console.log("e");
          console.log(element);

          scope.selectedItem = record;
          scope.showViewer = true;
        };

        scope.imageViewerclicked = function() {

          console.log("imageViewerclicked");

          scope.selectedItem = null;

          scope.showViewer = false;

        };

      }
    };
  }]);