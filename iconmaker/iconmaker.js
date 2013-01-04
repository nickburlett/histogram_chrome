$(function() {
    var img = $('#srcImg'),
        icons = $('.histogram'),
        iconaverage = $('.histogram-average'),
        coloricons = $('.color-histogram'),
        mainicon = $('.mainicon'),
        hist = {},
        histaverage = {},
        colorhist = {},
        drawbg = function (options) {
            var options = options || {};
            return function() {
                var ctx = this.getContext('2d'),
                    $this = $(this);
                ctx.fillStyle = options.fillStyle || '#1a3f54'; 
                ctx.fillRect(0, 0, $this.attr('height'), $this.attr('width'));
            }
        },
        drawicon = function () {
            var ctx = this.getContext('2d'),
                opts = { histData:hist
                       , color:"rgba(255,255,255,0.8)"
                       , xOffset: 16
                       , yOffset: 16
                       , width:96
                       , height:96
                       }
            ctx.fillStyle = '#1a3f54';
            ctx.fillRect(16, 16, 96, 96);
            return $(this).pixastic('overlayHistogram', opts);
        },
        srcify = function() {
            $(this).replaceWith( $('<img>').attr( { width: this.width, height: this.height, src: this.toDataURL() } ) );
        };
    img.load( function() {
        img.pixastic('histogram', { average : false, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist }).each( srcify );
        img.pixastic('histogram', { average : true, paint:false,color:"rgba(255,255,255,0.8)",returnValue:histaverage }).each( srcify );
        img.pixastic('colorhistogram', { average : true, paint:false,color:"rgba(255,255,255,0.8)",returnValue:colorhist }).each( srcify );
        icons.each(drawbg()).pixastic('overlayHistogram', {histData:hist, color:"rgba(255,255,255,0.8)" }).each( srcify );
        iconaverage.each(drawbg()).pixastic('overlayHistogram', {histData:histaverage, color:"rgba(255,255,255,0.8)" }).each( srcify );
        coloricons.each(drawbg({fillStyle: '#85a2b2'})).pixastic('overlayHistogram', {inline: true, histData:colorhist, opacity: 0.9 }).each( srcify );
        mainicon.each( drawicon )
        $('.mainicon').each( srcify );
    });
});
