
$(function() {
        var $clickit = $('<div style="margin-top: 1em;"></div>'),
            $toggle = $('<a href="#">Toggle Histogram</a>');
        $toggle.click( function() { 
            clickedEl = $('#thephoto img')[0];
            window.handleRequest( {kind:'info', clickSrc: clickedEl.src} );
        });
        $clickit.append($toggle);

        $('#copyright').append($clickit);

        $('#thephoto,#lightbox').bind("contextmenu", function(e) {
            $('#copyright').css('left', e.clientX).css('top', e.clientY).css('position', 'absolute').css('z-index', 50000);
            $('#copyright').clearQueue().fadeIn().delay(4000).fadeOut('slow');
            e.stopPropagation();
            e.preventDefault();
        });
});
