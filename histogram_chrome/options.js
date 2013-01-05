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
    var input = $(this),
        value = undefined;
    if (input.attr('type') == 'checkbox') {
        value = input.prop('checked');
    } else if (input.attr('type') == 'radio') {
        value = input.prop('checked') ? input.prop('value') : undefined;
    } else {
        value = input.prop('value');
    }
    if (value !== undefined) {
        localStorage[input.attr('name')] = value;
        recomputeExample();
    }
});

function adjustSubOptions() {
    var $self = $(this);
    $('div[data-for='+$self.attr('name')+']').each( function() {
        $this = $(this)
        if ( $self.attr('checked') && $self.attr('value') == $this.attr('data-value') ) {
            $this.removeClass('disabled').find('input').removeAttr('disabled');
        } else {
            $this.addClass('disabled').find('input').attr('disabled', 'disabled');
        }
    });
}

$('input[name="color_histogram"]').change( adjustSubOptions );

// Restores select box state to saved value from localStorage.
function set_option() {
    var input = $(this),
        value = parse(localStorage[input.attr('name')]);
    if (input.attr('type') == 'checkbox') {
        input.prop('checked', value);
    } else if (input.attr('type') == 'radio') {
        if (parse(input.attr('value')) == value) {
            input.prop('checked', true); 
        }
    } else {
        input.prop('value', value);
    }
}

function restore_options() {
    $('input').each( set_option );

    $('input[name="color_histogram"]:checked').each( adjustSubOptions );
    recomputeExample();
}

$(window).bind('storage', restore_options);



restore_options();
});

