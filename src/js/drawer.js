;(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  'use strict';
  var namespace = 'drawer';
  var touches = typeof document.ontouchstart != 'undefined';
  var __ = {
    init: function(options) {
      options = $.extend({
        iscroll: {
          mouseWheel: true,
          preventDefault: false
        },
      }, options);

      __.settings = {
        state: false,
        class: {
          nav: 'drawer-nav',
          toggle: 'drawer-toggle',
          upper: 'drawer-overlay',
          open: 'drawer-open',
          close: 'drawer-close',
          dropdown: 'drawer-dropdown'
        },
        events: {
          opened: 'drawer.opened',
          closed: 'drawer.closed'
        }
      };

      return this.each(function() {
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);

        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, { options: options });

          var iScroll = new IScroll('.' + __.settings.class.nav, options.iscroll);

          __.addOverlay.call(_this);

          $(document).on('click.' + namespace, '.' + __.settings.class.toggle, function() {
            __.toggle.call(_this);
            return iScroll.refresh();
          });

          $(window).resize(function() {
            __.close.call(_this);
            return iScroll.refresh();
          });

          $('.' + __.settings.class.dropdown)
            .on(options.dropdownEvents.opened + ', ' + options.dropdownEvents.closed, function() {
              return iScroll.refresh();
            });
        }

      }); // end each
    },

    addOverlay: function(options) {
      var _this = this;
      var $this = $(this);
      options = $this.data(namespace).options;
      var $upper = $('<div>').addClass(__.settings.class.upper + ' ' + __.settings.class.toggle);

      return $this.append($upper);
    },

    toggle: function() {
      var _this = this;

      if (__.settings.state){
        return __.close.call(_this);
      } else {
        return __.open.call(_this);
      }
    },

    open: function(options) {
      var $this = $(this);
      options = $this.data(namespace).options;

      if (touches) {
        $this.on('touchmove.' + namespace, function(event) {
          event.preventDefault();
        });
      }

      return $this
        .removeClass(__.settings.class.close)
        .addClass(__.settings.class.open)
        .drawerCallback(function(){
          $this.css({
            'overflow': 'hidden'
          }).trigger('drawer.opened');
          __.settings.state = true;
          $this.trigger(__.settings.events.opened);
        });
    },

    close: function(options) {
      var $this = $(this);
      options = $this.data(namespace).options;

      if (touches) $this.off('touchmove.' + namespace);

      return $this
        .removeClass(__.settings.class.open)
        .addClass(__.settings.class.close)
        .drawerCallback(function(){
          $this.css({
            'overflow': 'auto'
          }).trigger('drawer.closed');
          __.settings.state = false;
          $this.trigger(__.settings.events.closed);
        });
    },

    destroy: function() {
      return this.each(function() {
        var $this = $(this);
        $(window).off('.' + namespace);
        $this.removeData(namespace);
      });
    }

  };

  $.fn.drawerCallback = function(callback){
    var end = 'transitionend webkitTransitionEnd';
    return this.each(function() {
      var $this = $(this);
      $this.on(end, function(){
        $this.off(end);
        return callback.call(this);
      });
    });
  };

  $.fn.drawer = function(method) {
    if (__[method]) {
      return __[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return __.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.' + namespace);
    }
  };

}));
