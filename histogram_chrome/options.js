$( function() {
var exampleSrc = $('#example_src'),
    exampleImg = $('#example');

function recomputeExample( ) {
    var newImg = $('<img>');
    newImg.load( function() {
        exampleImg.attr( 'src', newImg.map( draw_histogram ).get()[0].toDataURL() );
    });
    newImg.attr('src', exampleSrc.attr('src'));
}

function parse(type) {
   return typeof type == 'string' ? JSON.parse(type) : type;
}

$('input').change( function() {
    var checkbox = $(this);
    var checked = checkbox.is(':checked');
    localStorage[checkbox.attr('name')] = checked;
    recomputeExample();
});


// Restores select box state to saved value from localStorage.
function restore_options() {
    $('input').each( function() {
        var checkbox = $(this),
            checked = parse(localStorage[checkbox.attr('name')]);
        checkbox.prop('checked', checked);
    });
    recomputeExample();
}

function storageChange(e) {
    var key = e.originalEvent.key,
        val = e.originalEvent.newValue;

    $('input[name='+key+']').prop('checked', parse(val));
    recomputeExample();
}

$(window).bind('storage', storageChange);



restore_options();
});

