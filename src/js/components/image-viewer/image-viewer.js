angular.module('imageViewer', [])
    .directive('imageViewer', function() {
        return {
            restrict: 'E',
            templateUrl: 'image-viewer.html',
            scope: {
                list: '='
            },
            link: function(scope, element, attrs) {
                scope.shouldShowAll = false;
                scope.rest = function(list) {
                    return list.length > 4 ? "+" + (list.length - 4) : null;
                };

                scope.showAll = function(list, index) {
                    var pswpElement = element[0].querySelector('.pswp');
                    var items = list.map(function(x) {
                        return {
                            src: x.imagePath,
                            w: 0,
                            h: 0,
                            title: x.description
                        };
                    });

                    var options = {
                        index: index,
                        history: false
                    };

                    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
                    gallery.listen('gettingData', function(index, item) {
                        if (item.w < 1 || item.h < 1) {
                            var img = new Image();
                            img.onload = function() {
                                item.w = this.width;
                                item.h = this.height;
                                gallery.invalidateCurrItems();
                                gallery.updateSize(true);
                            }
                            img.src = item.src;
                        }
                    });
                    gallery.init();
                };
            }
        };
    });
