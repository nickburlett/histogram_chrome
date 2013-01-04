$( function() {
// Saves options to localStorage.
function parse(type) {
   return typeof type == 'string' ? JSON.parse(type) : type;
}

$('input').change( function() {
    var checkbox = $(this);
    var checked = checkbox.is(':checked');
    localStorage[checkbox.attr('name')] = checked;
});


// Restores select box state to saved value from localStorage.
function restore_options() {
    $('input').each( function() {
        var checkbox = $(this),
            checked = parse(localStorage[checkbox.attr('name')]);
        checkbox.prop('checked', checked);
    });
}

function storageChange(e) {
    var key = e.originalEvent.key,
        val = e.originalEvent.newValue;

    $('input[name='+key+']').prop('checked', parse(val));
}

$(window).bind('storage', storageChange);



restore_options();
});

