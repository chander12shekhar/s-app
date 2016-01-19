var fMultiselect = function() {
  var focus = $(document.activeElement);
  var container = $(focus).closest('.scrollable-content');
  var pos = focus.offset();
  var currentPosition = $(container).scrollTop();
  var position = pos.top;
  var padding = $(container).css('padding-bottom');
  /*$(container).css("padding-bottom", "30vh");*/
  $(focus).blur(function() {
    $(container).css('padding-bottom', padding);
  });
  $(container).animate({scrollTop: currentPosition + position}, 800, 'swing');
};
