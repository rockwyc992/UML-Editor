'use strict';

define(['Template'], function(Template) {
    class Canvas {
        constructor(mode) {
            this.mode = mode;

            this.canvas = $('#canvas');
            this.viewport = this.canvas.children('#viewport');
            this.lines = this.canvas.children('#line-container');
            this.temp_line = {
                'association': this.canvas.find('#association-temp'),
                'generalization': this.canvas.find('#generalization-temp'),
                'composition': this.canvas.find('#composition-temp')
            };

            this.canvas.click(this.mode.canvas_click.bind(this.mode));
            this.canvas.mousedown(this.mode.canvas_mousedown.bind(this.mode));
            this.canvas.mousemove(this.mode.canvas_mousemove.bind(this.mode));
            this.canvas.mouseup(this.mode.canvas_mouseup.bind(this.mode));
        }

        append(element) {
            this.viewport.append(element);
        }

        append_line(line) {
            this.lines.append(line);
        }

        children() {
            return this.viewport.children();
        }

        group() {
            var select = this.selected;
            this.unselect_all();

            if (select.size() > 1) {
                var group = Template.get_element('group', this.mode.new_id(), 0, 0);
                $(group).append(select);
                $(group).mousedown(this.mode.basic_mousedown.bind(this.mode));

                this.append(group);
            }
        }

        ungroup() {
            var select = this.selected;
            this.unselect_all();

            if (select.size() == 1) {
                if (this.is_group(select)) {
                    var select_offset = Canvas.object_offset(select);
                    var children = select.children();
                    children.each(function(i, obj) {
                        var offset = Canvas.object_offset($(obj));
                        offset.x += select_offset.x;
                        offset.y += select_offset.y;
                        $(obj).attr('transform', 'translate(' + offset.x + ',' + offset.y + ')');
                    }.bind(this));
                    this.append(children);
                    select.remove();
                }
            }
        }

        rename(value) {
            var select = this.selected;
            this.unselect_all();
            select.each(this.do_rename.bind(this, value));
        }

        do_rename(value, i, obj) {
            if (this.is_basic(obj)) {
                $(obj).children('text').html(value);
            } else if (this.is_group(obj)) {
                $(obj).children().each(this.do_rename.bind(this, value));
            }
        }

        is_basic(obj) {
            return ($(obj).attr('class') === 'basic');
        }

        is_group(obj) {
            return ($(obj).attr('class') === 'group');
        }

        is_top(obj) {
            var objs = this.children();
            for (var i = 0; i < objs.size() ; i++) {
                if ($(objs[i]).is($(obj))) {
                    return true;
                }
            }
            return false;
        }

        get selected() {
            return $('.select');
        }

        select(obj) {
            var attr = $(obj).attr('class');
            if (attr === 'basic') {
                $(obj).attr('class', 'basic select');
            } else if (attr === 'basic select') {
                $(obj).attr('class', 'basic select');
            } else if (attr === 'group') {
                $(obj).attr('class', 'group select');
            } else if (attr === 'group select') {
                $(obj).attr('class', 'group select');
            }
        }

        unselect(obj) {
            var attr = $(obj).attr('class');
            if (attr === 'basic') {
                $(obj).attr('class', 'basic');
            } else if (attr === 'basic select') {
                $(obj).attr('class', 'basic');
            } else if (attr === 'group') {
                $(obj).attr('class', 'group');
            } else if (attr === 'group select') {
                $(obj).attr('class', 'group');
            }
        }

        is_select(obj) {
            var attr = $(obj).attr('class');
            if (attr === 'basic select') {
                return true;
            } else if (attr === 'group select') {
                return true;
            }
            return false;
        }

        toggle_select(obj) {
            var attr = $(obj).attr('class');
            if (attr === 'basic') {
                $(obj).attr('class', 'basic select');
            } else if (attr === 'basic select') {
                $(obj).attr('class', 'basic');
            } else if (attr === 'group') {
                $(obj).attr('class', 'group select');
            } else if (attr === 'group select') {
                $(obj).attr('class', 'group');
            }
        }

        unselect_all() {
            this.selected.each(function(i, obj) {
                this.unselect(obj);
            }.bind(this));
        }

        set cursor(type) {
            this.canvas.css('cursor', type);
        }

        get offset() {
            var offset = this.canvas.offset();
            offset.x = offset.left;
            offset.y = offset.top;
            delete offset.left;
            delete offset.top;
            return offset;
        }

        update(line, start, end) {
            console.log(line, start, end);
            var offset = end;
            var degree = this.get_degree(start, end);
            var length = this.get_length(start, end);
            $(line).attr('transform', 'translate(' + offset.x + ',' + offset.y + ') rotate(' + degree + ')');
            $(line).children('.line').attr('d', 'M 0 0 L ' + length + ' 0');
        }

        update_all_line() {
            this.lines.children('.line').each(function(i, line) {
                var start = this.get_port($(line).attr('g-start'));
                var end = this.get_port($(line).attr('g-end'));
                this.update(line, start, end);
            }.bind(this));
        }

        get_degree(start, end) {
            var x = Math.abs(start.x - end.x);
            var y = Math.abs(start.y - end.y);
            var z = Math.sqrt(x*x + y*y);
            var degree = Math.round(Math.acos(x / z) / Math.PI * 180);
            if (start.x > end.x) {
                if (start.y > end.y) {
                    degree = degree;
                } else {
                    degree = -degree;    
                }
            } else {
                if (start.y > end.y) {
                    degree = 180 - degree;    
                } else {
                    degree = 180 + degree;    
                }
            }
            return degree;
        }

        get_length(start, end) {
            var x = Math.abs(start.x - end.x);
            var y = Math.abs(start.y - end.y);
            var length = Math.sqrt(x*x + y*y);
            return length;
        }

        get_port(id) {
            var offset = $('#' + id).offset();
            console.log('#' + id, offset, this.offset);
            offset.x = offset.left;
            offset.y = offset.top;
            offset.x -= this.offset.x;
            offset.y -= this.offset.y;
            delete offset.left;
            delete offset.top;

            return offset;
        }

        page_offset(obj) {
            var offset = $(obj).offset();
            offset.x = offset.left + 5;
            offset.y = offset.top + 5;
            offset.x -= this.offset.x;
            offset.y -= this.offset.y;
            delete offset.left;
            delete offset.top;

            return offset;
        }

        static object_size(obj) {
            var width = $(obj).attr('width_');
            var height = $(obj).attr('height_');
            var size = {
                x: parseFloat(width),
                y: parseFloat(height)
            }

            return size;
        }

        static object_offset(obj) {
            var attr = $(obj).attr('transform');
            var split = attr.split(/[(,)]/);
            var offset = {
                x: parseFloat(split[1]),
                y: parseFloat(split[2])
            }

            return offset;
        }
    }

    return Canvas;
});

