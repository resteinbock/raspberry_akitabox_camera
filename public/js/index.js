var RpiApp = {
    events: {
        init: function() {
            RpiApp.events.click.toggleGroup();
        },
        click: {
            toggleGroup: function () {
                $('.btn-group').on('click', function (e) {
                    var $el = $(e.currentTarget);
                    var div_group_id = '#' + $el.data('div-group-id');

                    $('.div-carousel').hide();
                    $(div_group_id).show();
                    $el.blur();
                });

            }
        }
    }
};

$(document).ready(function() {
    RpiApp.events.init();
});