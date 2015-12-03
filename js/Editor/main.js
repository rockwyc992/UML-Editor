define(['Editor/Template'], function(Template) {
    function Editor() {
        this.canvas = $('#canvas');
        this.viewport = this.canvas.children('#viewport');
        this.lines = this.canvas.children('#line-container');
        this.select_area = this.canvas.children('#select-area');
        this.line_temp = {
            association: this.canvas.find('#association-temp'),
            generalization: this.canvas.find('#generalization-temp'),
            composition: this.canvas.find('#composition-temp')
        };
        this.id = 0;
        this.mode = null;
        this.value = null;
        this.x;
        this.y;

        this.init();
    }

    Editor.prototype.get_mode = function() {
        return this.mode;
    }

    Editor.prototype.is_mode = function(modes) {
        for(var i in modes) {
            if (this.get_mode() === modes[i]) {
                return true;
            }
        }
        return false;
    }

    Editor.prototype.new_id = function() {
        this.id++;
        return 'g-' + this.id;
    }

    Editor.prototype.get_id = function() {
        return 'g-' + this.id;
    }

    Editor.prototype.init = function() {
        this.canvas.click(this.canvas_click.bind(this));
        this.canvas.mousedown(this.canvas_mousedown.bind(this));
        this.canvas.mousemove(this.canvas_mousemove.bind(this));
        this.canvas.mouseup(this.canvas_mouseup.bind(this));
    }

    Editor.prototype.canvas_mousedown = function(event) {
        if (this.is_mode(['select'])) {
            if ($(event.target).is(this.canvas)) {
                this.event = event;
                this.unselect_all();
            }
        }
    }

    Editor.prototype.canvas_mousemove = function(event) {
        if (this.event) {
            var source = $(this.event.currentTarget);
            var start = {
                x: this.event.pageX,
                y: this.event.pageY
            }
            var end = {
                x: event.pageX,
                y: event.pageY
            }
            if (this.is_mode(['select'])) {
                if (source.is(this.canvas)) {
                    if (start.x > end.x) {
                        if (start.y > end.y) {
                            this.canvas.css('cursor', 'nw-resize');
                        } else {
                            this.canvas.css('cursor', 'ne-resize');
                        }
                    } else {
                        if (start.y > end.y) {
                            this.canvas.css('cursor', 'sw-resize');
                        } else {
                            this.canvas.css('cursor', 'se-resize');
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
                    var offset = this.canvas.offset();
                    offset.x = start.x - offset.left;
                    offset.y = start.y - offset.top;
                    this.select_area.attr('height', height);
                    this.select_area.attr('width', width);
                    this.select_area.attr('transform', 'translate(' + offset.x + ',' + offset.y + ')');
                } else {
                    var x = this.offset.x + event.pageX - this.event.pageX;
                    var y = this.offset.y + event.pageY - this.event.pageY;
                    source.attr('transform', 'translate(' + x + ',' + y + ')');
                }
                this.update_all_line();
            } else if (this.is_mode(['association','generalization','composition'])) {
                if (this.line) {
                    this.line.show();
                    var start = this.get_middle_offset(source);
                    this.update_line(this.line, start, end);
                }
            }
        }
    }

    Editor.prototype.get_degree = function(start, end) {
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

    Editor.prototype.get_length = function(start, end) {
        var x = Math.abs(start.x - end.x);
        var y = Math.abs(start.y - end.y);
        var length = Math.sqrt(x*x + y*y);
        return length;
    }

    Editor.prototype.canvas_mouseup = function(event) {
        if (this.event) {
            if (this.is_mode(['select'])) {
                var source = $(this.event.currentTarget);
                if (source.is(this.canvas)) {
                    var start = {
                        x: this.event.pageX,
                        y: this.event.pageY
                    }
                    var end = {
                        x: event.pageX,
                        y: event.pageY
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
                    var select = this.viewport.children();
                    select.each(function(i, obj) {
                        if (this.in_range(obj, start, end)) {
                            this.select(obj);
                        }
                    }.bind(this));
                    this.canvas.css('cursor', 'auto');
                    this.select_area.attr('height', 0);
                    this.select_area.attr('width', 0);
                }
            } else if (this.is_mode(['association','generalization','composition'])) {
                if(this.line) {
                    this.line.hide();
                    this.line = null;
                }
            }
            this.event = null;
        }
    }

    Editor.prototype.in_range = function(obj, start, end) {
        if ($(obj).attr('class') === 'basic') {
            var offset = $(obj).offset();
            offset.top += 5;
            offset.left += 5;
            if ($(obj).children('rect').size()) {
                offset.bottom = offset.top + 130;
                offset.right = offset.left + 200;
            } else {
                offset.bottom = offset.top + 80;
                offset.right = offset.left + 200;
            }
            if (start.x > offset.left) {
                return false;
            } else if (start.y > offset.top) {
                return false;
            } else if (end.x < offset.right) {
                return false;
            } else if (end.y < offset.bottom) {
                return false;
            }
        } else if ($(obj).attr('class') === 'group') {
            var objs = $(obj).children();
            for (var i = 0; i < objs.size() ; i++) {
                if (!this.in_range(objs[i], start, end)) {
                    return false;
                }
            }
        }
        return true;
    }

    Editor.prototype.canvas_click = function(event) {
        var target = $(event.currentTarget);
        if (this.is_mode(['class','use_case'])) {
            var offset = target.offset();
            var x = event.pageX - offset.left;
            var y = event.pageY - offset.top;

            var element = Template.get_element(this.get_mode(), this.new_id(), x, y);
            $(element).mousedown(this.basic_mousedown.bind(this));
            $(element).mouseup(this.basic_mouseup.bind(this));

            this.viewport.append(element);
        }
    }

    Editor.prototype.basic_mousedown = function(event) {
        event.preventDefault();
        var target = $(event.currentTarget);
        if (this.is_mode(['select'])) {
            this.event = event;
            this.offset = this.get_offset(target);
            if (target.parent().is(this.viewport)) {
                this.unselect_all();
                this.select(target);
                this.viewport.append(target);
            }
        } else if (this.is_mode(['association','generalization','composition'])) {
            this.event = event;
            this.line = null;
            if (this.is_mode(['association'])) {
                this.line = this.line_temp.association;
            } else if(this.is_mode(['generalization'])) {
                this.line = this.line_temp.generalization;
            } else if(this.is_mode(['composition'])) {
                this.line = this.line_temp.composition;
            }
            this.offset = this.get_middle_offset(target);
        }
    }

    Editor.prototype.basic_mouseup = function(event) {
        var target = $(event.currentTarget);
        if (this.is_mode(['association','generalization','composition'])) {
            if (this.event) {
                var source = $(this.event.currentTarget);
                if (!source.is(target)) {
                    var start = this.get_middle_offset(source);
                    var end = this.get_middle_offset(target);
                    var element = Template.get_line(this.get_mode(), this.new_id(), source.attr('id'), target.attr('id'));
                    this.lines.append(element);
                    this.update_line(element, start, end);
                }
            }
        }
    }

    Editor.prototype.group = function() {
        var select = $('.select');
        this.unselect_all();

        if (select.size() > 1) {
            var group = Template.get_element('group', this.new_id(), 0, 0);
            $(group).append(select);
            $(group).mousedown(this.group_mousedown.bind(this));

            this.viewport.append(group);
        }
    }

    Editor.prototype.group_mousedown = function(event) {
        var target = $(event.currentTarget);
        if (this.is_mode(['select'])) {
            this.event = event;
            this.offset = this.get_offset(target);
            if (target.parent().is(this.viewport)) {
                this.unselect_all();
                this.select(target);
                this.viewport.append(target);
            }
        }
    }

    Editor.prototype.ungroup = function() {
        var select = $('.select');
        this.unselect_all();

        if (select.size() == 1) {
            if (select.attr('class') === 'group') {
                var select_offset = this.get_offset(select);
                var child = select.children();
                child.each(function(i, obj) {
                    var offset = this.get_offset($(obj));
                    offset.x += select_offset.x;
                    offset.y += select_offset.y;
                    $(obj).attr('transform', 'translate(' + offset.x + ',' + offset.y + ')');
                }.bind(this));
                this.viewport.append(child);
                select.remove();
            }
        }
    }

    Editor.prototype.rename = function(value) {
        var select = $('.select');
        this.unselect_all();

        this.value = value;
        select.each(this.do_rename.bind(this));
        this.value = null;
    }

    Editor.prototype.do_rename = function(i, obj) {
        if ($(obj).attr('class') === 'basic') {
            $(obj).children('text').html(this.value);
        } else if ($(obj).attr('class') === 'group') {
            $(obj).children().each(this.do_rename.bind(this));
        }
    }
    
    Editor.prototype.get_offset = function(obj) {
        var attr = obj.attr('transform');
        var split = attr.split(/[(,)]/);
        var offset = {
            x: parseFloat(split[1]),
            y: parseFloat(split[2])
        }

        return offset;
    }

    Editor.prototype.toggle_select = function(obj) {
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

    Editor.prototype.select = function(obj) {
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

    Editor.prototype.unselect = function(obj) {
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

    Editor.prototype.unselect_all = function() {
        $('.select').each(function(i, obj) {
            this.unselect(obj);
        }.bind(this));
    }

    Editor.prototype.update_line = function(line, start, end) {
        var offset = $(this.canvas).offset();
        var x = end.x - offset.left;
        var y = end.y - offset.top;
        var degree = this.get_degree(start, end);
        var length = this.get_length(start, end);
        $(line).attr('transform', 'translate(' + x + ',' + y + ') rotate(' + degree + ')');
        $(line).children('.line').attr('d', 'M 0 0 L ' + length + ' 0');
    }

    Editor.prototype.update_all_line = function() {
        this.lines.children('.line').each(function(i, line) {
            var start = this.get_middle_offset($('#' + $(line).attr('g-start')));
            var end = this.get_middle_offset($('#' + $(line).attr('g-end')));
            this.update_line(line, start, end);
        }.bind(this));
    }

    Editor.prototype.get_middle_offset = function(obj) {
        var obj_offset = obj.offset();
        var offset = {};
        if ($(obj).children('rect').size()) {
            offset.x = obj_offset.left + 95;
            offset.y = obj_offset.top + 60;
        } else {
            offset.x = obj_offset.left + 95;
            offset.y = obj_offset.top + 35;
        }
        return offset;
    }

    return Editor;
});
