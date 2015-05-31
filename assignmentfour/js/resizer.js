function initResizer() {
    var resizer = function() {
        winWidth = $(window).width();
        winHeight = $(window).height();

        if (winWidth > 999) {
            $('.graph-panel').removeClass('graph-panel-show');
            $('.market-status').fadeIn(0);
            $('.market-list').fadeIn(0);
            if( page == "metal-main.html") {
                $('.my_stack').fadeIn(0);
            }
            $('.mtb-2').removeClass('mobile-toggle-selected');
            $('.mtb-1').addClass('mobile-toggle-selected');
        }
    };
}
