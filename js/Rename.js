'use strict';

define(function() {
    class Rename {
        constructor(editor) {
            this.editor = editor;
            this.container = $('#rename-container');
            this.input = this.container.children('input');
        }

        show() {
            this.container.show();
            this.input.focus();
        }

        hide() {
            this.input.val(null);
            this.container.hide();
        }

        ok() {
            var value = this.input.val();
            this.hide();
            this.editor.rename(value);
        }

        cancel() {
            this.hide();
        }
    }

    return Rename;
});
