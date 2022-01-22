(function(window, document, $) { // eslint-disable-line prefer-arrow/prefer-arrow-functions
    'use strict';
    const verticleGrace = 20;
    const cuttoffGrace = 200;

    $(document).ready(() => {
        const $navListItems = $('#index-nav li');
        const $win = $(window);
        const articleIds = [ '#orgs', '#tipsntricks', '#programming', '#cv', '#about' ];

        // Applies the selected class to the current nav item
        const toggleSelected = ($selectedItem) => {
            // Remove any existing selected classes.
            $navListItems.removeClass('selected');
            // Set Selected on current li.
            $selectedItem.addClass('selected');
        };

        const onClick = (ev) => {
            const $trgt = $(ev.target);
            toggleSelected($navListItems, $trgt);
        };

        $('#index-nav').on('click', 'li', onClick);

        const toggleSelectedScroll = () => {
            const scrollY = $win.scrollTop() - verticleGrace;

            const checkScroll = (i, val) => {
                const $navItem = $(`a[href="${val}"`).parent(); // List item of nav link to section.
                const $sectionEl = $(val);
                const offset = $sectionEl.offset();
                const cutoff = offset.top - cuttoffGrace;

                if (scrollY > cutoff) {
                    // Scrolled to the next section
                    toggleSelected($navItem);
                    return false; // Break out of each loop
                }
                return true;
            };

            // Check the last sections first so we can stop at the first found section.
            $.each(articleIds, checkScroll);
        };
        // Set the initial selected based on scroll
        toggleSelectedScroll();

        $win.scroll(toggleSelectedScroll);
    });
})(window, document, jQuery);
