'use strict'

define(function() {
    class Mode {
        constructor(offset) {
            this.offset = offset;
            this.source_ = null;
            this.target_ = null;
        }

        event_offset(event) {
            var offset = {
                x: 0,
                y: 0
            }
            if (event) {
                offset.x = event.pageX - this.offset.x;
                offset.y = event.pageY - this.offset.y;
            }
            return offset;
        }

        is_mousedown() {
            return (this.source !== null);
        }

        set source(event) {
            this.source_ = event;
        }

        get source() {
            if (this.source_) {
                return $(this.source_.currentTarget);
            } else {
                return null;
            }
        }

        get start() {
            return this.event_offset(this.source_);
        }

        is_mouseup() {
            if (this.is_mousedown()) {
                if (this.target_.type === 'mouseup') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }

        set target(event) {
            this.target_ = event;
        }

        get target() {
            if (this.target_) {
                return $(this.target_.currentTarget);
            } else {
                return null;
            }
        }

        get end() {
            return this.event_offset(this.target_);
        }

        canvas_click() {
        }

        canvas_mousedown() {
        }

        canvas_mousemove() {
        }

        canvas_mouseup() {
        }

        basic_mousedown() {
        }

        basic_mouseup() {
        }

    }
    
    return Mode;
});
