
//
// Special event to trigger DOM node removal
//
(function($){
  $.event.special.removed = {
    remove: function(o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery)
