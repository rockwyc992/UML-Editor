'use strict';

define(['Rename'], function(Rename) {
    class Tab {
        constructor(editor) {
            this.editor = editor;
            this.rename = new Rename(this.editor);
            this.bind_tabs();
        }

        bind_tabs() {
            $('.tabs > ul').each(function(i) {
                $(this).click(function() {
                    $(this).siblings('.enable').removeClass('enable');
                    $(this).toggleClass('enable');
                });
            });

            $('#group').click(this.editor.group.bind(this.editor));
            $('#ungroup').click(this.editor.ungroup.bind(this.editor));

            $('#rename').click(this.rename.show.bind(this.rename));
            $('#rename-ok').click(this.rename.ok.bind(this.rename));
            $('#rename-cancel').click(this.rename.cancel.bind(this.rename));
        }
    }

    return Tab;
});
