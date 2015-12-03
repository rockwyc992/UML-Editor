define(function() {
    function Tab(editor) {
        this.editor = editor;
        $('.tabs > ul').each(function(i) {
            $(this).click(function() {
                $(this).siblings('.enable').removeClass('enable');
                $(this).toggleClass('enable');
            });
        });

        $('#group').click(this.editor.group.bind(editor));
        $('#ungroup').click(this.editor.ungroup.bind(editor));
        $('#rename').click(function() {
            $('.rename-container').show();
        });
        $('#rename-cancel').click(function() {
            $('.rename-container').hide();
        });
        $('#rename-ok').click(function() {
            var input = $('.rename-container > input');
            var value = input.val();

            $('.rename-container').hide();
            input.val(null);

            this.editor.rename(value);
        }.bind(this));
    }

    return Tab;
});
