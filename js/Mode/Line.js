'use strict'

define(['Mode', 'Canvas'], function(Mode, Canvas) {
    class Line extends Mode {
        constructor(mode, canvas, temp_line, get_line) {
            super(canvas.offset);
            this.mode = mode;
            this.canvas = canvas;
            this.temp_line = temp_line;
            this.get_line = get_line;
        }

        get source_id() {
            if (this.source_) {
                return this.source.attr('id');
            } else {
                return null;
            }
        }

        get source_port() {
            if (this.source_) {
                var id = this.source_id;
                var port = this.get_port(this.source_);
                return id + '-' + port.type;
            } else {
                return null;
            }
        }

        get start() {
            var start = super.start;
            if (this.source_) {
                var port = this.get_port(this.source_);
                start.x = port.x;
                start.y = port.y;
            }
            return start;
        }

        get target_id() {
            if (this.target_) {
                return this.target.attr('id');
            } else {
                return null;
            }
        }
        
        get target_port() {
            if (this.target_) {
                var id = this.target_id;
                var port = this.get_port(this.target_);
                return id + '-' + port.type;
            } else {
                return null;
            }
        }

        get end() {
            var end = super.end;
            if (this.target) {
                if (this.is_mouseup()) {
                    var port = this.get_port(this.target_);
                    end.x = port.x;
                    end.y = port.y;
                }
            }
            return end;
        }

        get_port_offset(type, size) {
            if (type === 'top') {
                size.x = size.x * 1.0;
                size.y = size.y * 0.0;
            } else if (type === 'right') {
                size.x = size.x * 2.0;
                size.y = size.y * 1.0;
            } else if (type === 'bottom') {
                size.x = size.x * 1.0;
                size.y = size.y * 2.0;
            } else if (type === 'left') {
                size.x = size.x * 0.0;
                size.y = size.y * 1.0;
            } else {
                size.x = size.x * 0.0;
                size.y = size.y * 0.0;
            }
            size.type = type;
            return size;
        }

        get_port(event) {
            var target = (event.currentTarget);
            var target_offset = this.canvas.page_offset(target);
            var size = Canvas.object_size(target);
            size.x /= 2.0;
            size.y /= 2.0;
            var offset = super.event_offset(event);
            offset.x -= target_offset.x + size.x;
            offset.y -= target_offset.y + size.y;
            offset.x *= size.y;
            offset.y *= size.x;

            if (offset.x+offset.y > 0) {
                if (offset.x-offset.y>0) {
                    offset = this.get_port_offset('right', size);
                } else {
                    offset = this.get_port_offset('bottom', size);
                }
            } else {
                if (offset.x-offset.y>0) {
                    offset = this.get_port_offset('top', size);
                } else {
                    offset = this.get_port_offset('left', size);
                }
            }
            offset.x += target_offset.x;
            offset.y += target_offset.y;
            return offset;
        }

        canvas_mousemove(event) {
            if (this.is_mousedown()) {
                this.target = event;
                this.temp_line.show();
                this.canvas.update(this.temp_line, this.start, this.end);
            }
        }

        canvas_mouseup(event) {
            if (this.is_mousedown()) {
                this.temp_line.hide();
                this.source = null;
                this.target = null;
            }
        }

        basic_mousedown(event) {
            if (this.canvas.is_basic(event.currentTarget)) {
                this.source = event;
            }
        }

        basic_mouseup(event) {
            if (this.is_mousedown()) {
                this.target = event;
                if (!this.source.is(this.target)) {
                    var element = this.get_line(this.mode.new_id(), this.source_port, this.target_port);
                    $('#' + this.source_port).attr('class', 'linked');
                    $('#' + this.target_port).attr('class', 'linked');
                    this.canvas.append_line(element);
                    this.canvas.update(element, this.start, this.end);
                }
            }
        }
    }

    return Line;
});


