angular.module('rating', [])
    .directive('rating', function() {
        return {
            restrict: 'E',
            template: '<div class="rating red"><span ng-repeat="r in ratings track by $index" ng-class="r"></span></div>',
            scope: {},
            link: function(scope, element, attrs) {
                attrs.$observe('value', function(val) {
                    scope.ratings = [1, 2, 3, 4, 5].map(function(_, index) {
                        var extra = (val > index) ? val - index : 0;

                        if (index <= val && extra >= 1) return  'on';
                        else {
                            if(extra > 0.75 && extra <= 0.99) return 'on';
                            else if(extra > 0.25 && extra <= 0.75) return 'half';
                            else if(extra > 0 && extra <= 0.25) return 'off';
                            else return 'off';
                        }
                    });
                });
            }
        };
    })
    // Star Rating

  .directive("starRating", function() {
  return {
    restrict : "EA",
    template : "<ul class='starrating' ng-class='{readonly: readonly}'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "  <i class='fa icon-FBD-Rating'></i>"+
               //"    <i class='fa fa-star'></i>" + //&#9733
               "  </li>" +
               "</ul>",
    scope : {
      ratingValue : "=ngModel",
      max : "=?", //optional: default is 5
      onRatingSelected : "=?",
      readonly: "=?"
    },
    link : function(scope, elem, attrs) {
      if(scope.ratingValue === undefined) {
        scope.ratingValue = 0;
      }
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled : i < scope.ratingValue
          });
        }
      };
      scope.toggle = function(index) {
        if (scope.readonly == undefined || scope.readonly == false){
          scope.ratingValue = index + 1;
          if(scope.onRatingSelected !== undefined) {
            scope.onRatingSelected({
              rating: index + 1
            });
          }
        }
      };
      scope.$watch("ratingValue", function(oldVal, newVal) {
        if (newVal>=0) { updateStars(); }
      });
    }
  };
});
