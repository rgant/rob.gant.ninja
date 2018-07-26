(function (window, document, $) {
    "use strict";

    $(document).ready(function () {
        var $navListItems = $('#index-nav li');

        // Applies the selected class to the current nav item
        function toggleSelected($selectedItem) {
            // Remove any existing selected classes.
            $navListItems.removeClass('selected');
            // Set Selected on current li.
            $selectedItem.addClass('selected');
        }

        $('#index-nav').on('click', 'li', function() {
            var $trgt = $(this);
            toggleSelected($navListItems, $trgt);
        });

        var articleIds = ['#orgs', '#tipsntricks', '#programming', '#cv', '#about'];
        var $win = $(window);

        function toggleSelectedScroll() {
            var scrollY = $win.scrollTop() - 20;
            // Check the last sections first so we can stop at the first found section.
            $.each( articleIds, function( i, val ) {
                var $sectionEl = $( val );
                var offset = $sectionEl.offset();
                var cutoff = offset.top - 200;

                if (scrollY > cutoff) {
                    // Scrolled to the next section
                    var $navItem = $('a[href="' + val + '"').parent(); // List item of nav link to section.
                    toggleSelected($navItem);
                    return false;
                }
            });
        }
        // Set the initial selected based on scroll
        toggleSelectedScroll();

        $win.scroll(toggleSelectedScroll);
    });

}(window, document, jQuery));
