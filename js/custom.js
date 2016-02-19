(function(global) {
  function resize() {
    $('section .cut').each(function() {
      if ($(this).hasClass('cut-top-right'))
        $(this).css('border-right-width', $(this).parent().width()/2 + "px");
      else if ($(this).hasClass('cut-top-left'))
        $(this).css('border-left-width', $(this).parent().width()/2 + "px");
    });
  }

  global.addEventListener("resize", resize);
  resize();

  document.getElementById('header-image').className += 'loaded';
})(window);