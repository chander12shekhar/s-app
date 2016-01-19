angular.module('FoodeeBuddee.directives.Footer',[])
.directive('shareFooter', function() {

    return {
      templateUrl: 'commons/footer.html',
      restrict: 'E',
      scope: {
        items: '='
      },
      link: function($scope, $element, $attrs) {

      }
    };

  });