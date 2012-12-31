$(function() {
    var img = $('#srcImg'),
        icons = $('.histogram'),
        mainicon = $('.mainicon'),
        hist = {},
        drawbg = function () {
            var ctx = this.getContext('2d'),
                $this = $(this);
            ctx.fillStyle = '#1a3f54';
            ctx.fillRect(0, 0, $this.attr('height'), $this.attr('width'));
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
        img.pixastic('histogram', { average : true, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist });
        icons.each(drawbg).pixastic('overlayHistogram', {histData:hist, color:"rgba(255,255,255,0.8)" }).each( srcify );
        mainicon.each( drawicon )
        $('.mainicon').each( srcify );
    });
});
