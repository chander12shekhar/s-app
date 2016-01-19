angular.module('fallbackSrc', [])
    .directive('fallbackSrc', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if(!attrs.ngSrc || attrs.ngSrc.length === 0) {
                    element.attr('src', attrs.fallbackSrc);
                }

                element.bind('error', function(){
                    element.attr('src', attrs.fallbackSrc);
                });
            }
        };
    });
