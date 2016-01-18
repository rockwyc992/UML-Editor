'use strict';

define(function() {
    function Button(editor) {
        this.editor = editor;
        $('.buttons > button').each(function(i) {
            $(this).click(function() {
                var mode = null;
                $(this).siblings('.enable').removeClass('enable');
                $(this).toggleClass('enable');
                if ($(this).hasClass('enable')) {
                    mode = $(this).attr('id');
                }
                editor.change_mode(mode);
            });
        });
    }

    return Button;
});

