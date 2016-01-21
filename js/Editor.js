'use strict';

define(['Template', 'Canvas', 'Mode_Manager'], function(Template, Canvas, Mode) {
    class Editor {
        constructor() {
            this.template = Template;
            this.mode = new Mode(this, this.template);
            this.canvas = new Canvas(this.mode);
            this.mode.init_modes(this.canvas);
        }

        rename(value) {
            this.canvas.rename(value);
        }

        change_mode(type) {
            this.mode.type = type;
        }

        group() {
            this.canvas.group();
        }

        ungroup() {
            this.canvas.ungroup();
        }

    }

    return Editor;
});

