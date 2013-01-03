$( function() {
// Saves options to localStorage.
function parse(type) {
   return typeof type == 'string' ? JSON.parse(type) : type;
}
function save_options() {
    var checkbox = $("#color_histogram");
    var color = checkbox.is(':checked');
    localStorage["color_histogram"] = color;

    // Update status to let user know options were saved.
    var status = $("#status");
    status.html("Options Saved.");
    setTimeout(function() {
        status.html("");
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var color = parse(localStorage["color_histogram"])
    if (!color) {
        return;
    }
    var select = $("#color_histogram");
    select.prop('checked', color);
}
$('#save').click(save_options);
restore_options();
});

