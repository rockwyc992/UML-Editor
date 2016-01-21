'use strict';

define([
    'Mode',
    'Mode/Select', 
    'Mode/Association', 
    'Mode/Generalization',
    'Mode/Composition',
    'Mode/Class',
    'Mode/Use_Case'
], function(
    Mode,
    Select,
    Association,
    Generalization,
    Composition,
    Class,
    Use_Case
) {
    class Mode_Manager {
        constructor(editor, template) {
            this.editor = editor;
            this.template = template;

            this.null_mode = new Mode();
            this.mode = this.null_mode;
            this.modes = [];
            this.id_ = 0;
        }

        init_modes(canvas) {
            this.modes['select'] = new Select(canvas);
            this.modes['association'] = new Association(this, canvas, this.template);
            this.modes['generalization'] = new Generalization(this, canvas, this.template);
            this.modes['composition'] = new Composition(this, canvas, this.template);
            this.modes['class'] = new Class(this, canvas, this.template);
            this.modes['use_case'] = new Use_Case(this, canvas, this.template);
        }

        new_id() {
            this.id_++;
            return this.id;
        }

        get id() {
            return 'g-' + this.id_;
        }

        set type(mode) {
            if (mode === null) {
                this.mode = this.null_mode;
            } else {
                if (mode === 'select') {
                    $('.basic').css('cursor', 'move');
                } else {
                    $('.basic').css('cursor', 'default');
                }
                this.mode = this.modes[mode];
            }
            this.modes['select'].unselect_all();
        }

        canvas_click(event) {
            this.mode.canvas_click(event);
        }

        canvas_mousedown(event) {
            this.mode.canvas_mousedown(event);
        }

        canvas_mousemove(event) {
            this.mode.canvas_mousemove(event);
        }

        canvas_mouseup(event) {
            this.mode.canvas_mouseup(event);
        }

        basic_mousedown(event) {
            this.mode.basic_mousedown(event);
        }

        basic_mouseup(event) {
            this.mode.basic_mouseup(event);
        }
    }

    return Mode_Manager;
});


