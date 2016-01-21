'use strict'

define(['Mode', 'Canvas'], function(Mode, Canvas) {
    class Select extends Mode {
        constructor(canvas) {
            super(canvas.offset);
            this.canvas = canvas;
            this.area = $('#select-area');
        }

        canvas_mousedown(event) {
            this.source = event;
            this.unselect_all();
        }

        canvas_mousemove(event) {
            if (this.is_mousedown()) {
                this.target = event;

                if (this.source.is(this.target)) {
                    this.resize_area(this.start, this.end);
                } else {
                    var x = this.end.x - (this.start.x - this.mouseoffset.x);
                    var y = this.end.y - (this.start.y - this.mouseoffset.y);
                    this.source.attr('transform', 'translate(' + x + ',' + y + ')');
                    this.update_all_line();
                }
            }
        }

        canvas_mouseup(event) {
            if (this.is_mousedown()) {
                this.target = event;
                if (this.source.is(this.target)) {
                    var select = this.canvas.children();
                    select.each(function(i, obj) {
                        if (this.in_range(obj, this.start, this.end)) {
                            this.select(obj);
                        }
                    }.bind(this));
                    this.canvas.cursor = 'auto';
                    this.area.attr('height', 0);
                    this.area.attr('width', 0);
                    this.area.attr('transform', 'translate(0,0)');
                }
                this.target = null;
                this.source = null;
            }
        }

        resize_area(start, end) {
            if (start.x > end.x) {
                if (start.y > end.y) {
                    this.canvas.cursor = 'nw-resize';
                } else {
                    this.canvas.cursor = 'ne-resize';
                }
            } else {
                if (start.y > end.y) {
                    this.canvas.cursor = 'sw-resize';
                } else {
                    this.canvas.cursor = 'se-resize';
                }
            }

            if (start.x > end.x) {
                var t = start.x;
                start.x = end.x;
                end.x = t;
            }

            if (start.y > end.y) {
                var t = start.y;
                start.y = end.y;
                end.y = t;
            }

            var height = end.y - start.y;
            var width = end.x - start.x;

            this.area.attr('height', height);
            this.area.attr('width', width);
            this.area.attr('transform', 'translate(' + start.x + ',' + start.y + ')');
        }

        in_range(obj, start, end) {
            if (this.canvas.is_basic(obj)) {
                if (start.x > end.x) {
                    var t = start.x;
                    start.x = end.x;
                    end.x = t;
                }
                if (start.y > end.y) {
                    var t = start.y;
                    start.y = end.y;
                    end.y = t;
                }
                var offset = this.canvas.page_offset(obj);
                var size = Canvas.object_size(obj);
                if (start.x > offset.x) {
                    return false;
                } else if (start.y > offset.y) {
                    return false;
                } else if (end.x < offset.x + size.x) {
                    return false;
                } else if (end.y < offset.y + size.y) {
                    return false;
                }
            } else if (this.canvas.is_group(obj)) {
                var objs = $(obj).children();
                for (var i = 0; i < objs.size() ; i++) {
                    if (!this.in_range(objs[i], start, end)) {
                        return false;
                    }
                }
            }
            return true;
        }

        basic_mousedown(event) {
            this.source = event;
            if (this.canvas.is_top(this.source)) {
                event.stopPropagation();
                this.mouseoffset = Canvas.object_offset(this.source);
                this.unselect_all();
                this.select(this.source);
                this.canvas.append(this.source);
            }
        }

        unselect_all() {
            this.canvas.unselect_all();
        }

        select(obj) {
            this.canvas.select(obj);
        }

        unselect(obj) {
            this.canvas.unselect(obj);
        }

        update_all_line() {
            this.canvas.update_all_line();
        }
    }

    return Select;
});

