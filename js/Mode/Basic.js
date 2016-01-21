'use strict'

define(['Mode'], function(Mode) {
    class Basic extends Mode {
        constructor(mode, canvas, get_element) {
            super(canvas.offset);
            this.mode = mode;
            this.canvas = canvas;
            this.get_element = get_element;
        }

        canvas_click(event) {
            this.source = event;

            var element = this.get_element(this.mode.new_id(), this.start.x, this.start.y);
            $(element).mousedown(this.mode.basic_mousedown.bind(this.mode));
            $(element).mouseup(this.mode.basic_mouseup.bind(this.mode));

            this.canvas.append(element);
        }
    }
    
    return Basic;
});

