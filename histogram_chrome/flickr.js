(function ($) {

/**
* @function
* @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
* @param {function} handler A function to execute at the time when the element is inserted
* @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
* @example $(selector).waitUntilExists(function);
*/

$.fn.waitUntilExists	= function (handler, shouldRunHandlerOnce, isChild) {
	var found	= 'found';
	var $this	= $(this.selector);
	var $elements	= $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);
	
	if (!isChild)
	{
		(window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
			window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce, true); }, 500)
		;
	}
	else if (shouldRunHandlerOnce && $elements.length)
	{
		window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
	}
	
	return $this;
}

}(jQuery));

$(function() {
    $('.photo-context-menu').waitUntilExists( function() {
        var $clickit = $('<div class="photo-context-menu-sizes"></div>'),
            $toggle = $('<a href="#">Toggle Histogram</a>');
        $toggle.click( function() { 
            if ( !$('#lightbox').is('*') || $('#lightbox').is(':hidden')) {
                clickedEl = $('#photo img')[0];
            } else {
                clickedEl = $('#lightbox li.loaded').filter( function() { return $(this).css('visibility') != 'hidden'; } ).find('img')[0];
            }

            window.handleRequest( {kind:'info', clickSrc: clickedEl.src} );
        });
        $clickit.append($toggle);

        $(this).append($clickit);
    });

    $('a.spaceball').waitUntilExists( function() {
        $(this).removeClass('spaceball');
    });
});
