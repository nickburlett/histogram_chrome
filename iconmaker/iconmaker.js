$(function() {
    var img = $('#srcImg'),
        dest = $('.histogram'),
        hist = {},
        fillctx = function () {
            var ctx = this.getContext('2d'),
                $this = $(this);
            ctx.fillStyle = '#1a3f54';
            ctx.fillRect(0, 0, $this.attr('height'), $this.attr('width'));
        },
        srcify = function() {
            $(this).replaceWith( $('<img>').attr( { width: this.width, height: this.height, src: this.toDataURL() } ) );
        };
    img.load( function() {
        img.pixastic('histogram', { average : true, paint:false,color:"rgba(255,255,255,0.8)",returnValue:hist });
        dest.each( fillctx );
        dest.pixastic('overlayHistogram', {histData:hist, color:"rgba(255,255,255,0.8)"}).each( srcify );
    });
});
