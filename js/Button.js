define(function() {
    function Button(editor) {
        this.editor = editor;
        $('.buttons > button').each(function(i) {
            $(this).click(function() {
                $(this).siblings('.enable').removeClass('enable');
                $(this).toggleClass('enable');
                editor.mode = $(this).attr('id');
                editor.unselect_all();
            });
        });
    }

    return Button;
});

