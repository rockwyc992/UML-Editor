'use strict';

define(function() {
    class Template {
        static get_element(type, id, x, y) {
            if (type === 'class') {
                return Template.get_class(id, x, y);
            } else if (type === 'use_case') {
                return Template.get_use_case(id, x, y);
            } else if (type === 'group') {
                return Template.get_group(id, x, y);
            }
        }

        static get_line(type, id, source, target) {
            if (type === 'association') {
                return Template.get_association(id, source, target);
            } else if (type === 'generalization') {
                return Template.get_generalization(id, source, target);
            } else if (type === 'composition') {
                return Template.get_composition(id, source, target);
            }
        }

        static get_class(id, x, y) {
            var container = Template.make_SVG('g', {
                id: id, 
                class: 'basic', 
                transform: 'translate(' + x + ',' + y + ')',
                width_: 200,
                height_: 130
            });
            var name = Template.make_SVG('rect', {
                width: 200, 
                height: 50, 
                fill: '#999', 
                stroke: 'black', 
                transform: 'translate(0,0)'
            });
            var attr = Template.make_SVG('rect', {
                width: 200, 
                height: 30, 
                fill: '#555', 
                stroke: 'black', 
                transform: 'translate(0,50)'
            });
            var method = Template.make_SVG('rect', {
                width: 200, 
                height: 50, 
                fill: '#555', 
                stroke: 'black', 
                transform: 'translate(0,80)'
            });
            var text = Template.make_SVG('text', {
                'text-anchor': 'middle', 
                transform: 'translate(100,30)'
            });
            text.appendChild(document.createTextNode('Class Name'));
            var connect = Template.make_connect(id, 200, 130);

            container.appendChild(name);
            container.appendChild(attr);
            container.appendChild(method);
            container.appendChild(text);
            container.appendChild(connect);

            return container;
        }

        static get_use_case(id, x, y) {
            var container = Template.make_SVG('g', {
                id: id, 
                class: 'basic', 
                transform: 'translate(' + x + ',' + y + ')',
                width_: 200,
                height_: 80
            });
            var name = Template.make_SVG('ellipse', {
                cx: 100, 
                cy: 40, 
                rx: 100, 
                ry: 40, 
                fill: '#999', 
                stroke: 'black'
            });
            var text = Template.make_SVG('text', {
                'text-anchor': 'middle', 
                transform: 'translate(100,40)'
            });
            text.appendChild(document.createTextNode('Use Case Name'));
            var connect = Template.make_connect(id, 200, 80);

            container.appendChild(name);
            container.appendChild(text);
            container.appendChild(connect);

            return container;
        }

        static get_group(id, x, y) {
            var container = Template.make_SVG('g', {
                id: id, class: 'group', 
                transform: 'translate(' + x + ',' + y + ')'
            });

            return container;
        }

        static make_connect(id, x, y) {
            var half_x = x / 2;
            var half_y = y / 2;

            var container = Template.make_SVG('g', {
                class: 'connect', 
                transform: 'translate(-5,-5)'
            });
            var connect_top = Template.make_SVG('rect', {
                id: id + '-top',
                width: 10, 
                height: 10, 
                fill: 'black', 
                stroke: 'black', 
                transform: 'translate(' + half_x + ',0)'
            });
            var connect_left = Template.make_SVG('rect', {
                id: id + '-left',
                width: 10, 
                height: 10, 
                fill: 'black', 
                stroke: 'black', 
                transform: 'translate(0,' + half_y + ')'
            });
            var connect_right = Template.make_SVG('rect', {
                id: id + '-right',
                width: 10, 
                height: 10, 
                fill: 'black', 
                stroke: 'black', 
                transform: 'translate(' + x + ',' + half_y +')'
            });
            var connect_bottom = Template.make_SVG('rect', {
                id: id + '-bottom',
                width: 10, 
                height: 10, 
                fill: 'black', 
                stroke: 'black', 
                transform: 'translate(' + half_x +',' + y +')'
            });

            container.appendChild(connect_top);
            container.appendChild(connect_left);
            container.appendChild(connect_right);
            container.appendChild(connect_bottom);

            return container;
        }

        static get_association(id, source, target) {
            var container = Template.make_SVG('g', {
                id: id, 
                class: 'line association', 
                'g-start': source, 
                'g-end': target
            });
            var line = Template.make_SVG('path', {
                class: 'line', 
                stroke: 'black', 
                'stroke-width': 5, 
                'stroke-linejoin': 'round', 
                'stroke-linecap':'round'
            });
            var target = Template.make_SVG('path', {
                class: 'target', 
                fill: 'none', 
                stroke: 'none'
            });

            container.appendChild(line);
            container.appendChild(target);

            return container;
        }

        static get_generalization (id, source, target) {
            var container = Template.make_SVG('g', {
                id: id, 
                class: 'line generalization', 
                'g-start': source, 
                'g-end': target
            });
            var line = Template.make_SVG('path', {
                class: 'line', 
                stroke: 'black', 
                'stroke-width': 5, 
                'stroke-linejoin': 'round', 
                'stroke-linecap':'round'
            });
            var target = Template.make_SVG('path', {
                class: 'target', 
                d: 'M 0 0 L 20 0 L 0 20 z', 
                fill: 'white', 
                stroke: 'black', 
                'stroke-width': 5, 
                'stroke-linejoin': 'round', 
                'stroke-linecap':'round', 
                transform: 'rotate(-45)'
            });

            container.appendChild(line);
            container.appendChild(target);

            return container;
        }

        static get_composition(id, source, target) {
            var container = Template.make_SVG('g', {
                id: id, 
                class: 'line composition', 
                'g-start': source, 
                'g-end': target
            });
            var line = Template.make_SVG('path', {
                class: 'line', 
                stroke: 'black', 
                'stroke-width': 5, 
                'stroke-linejoin': 'round', 
                'stroke-linecap':'round'
            });
            var target = Template.make_SVG('path', {
                class: 'target', 
                d: 'M 0 0 L 15 5 L 20 20 L 5 15 z', 
                fill: 'white', 
                stroke: 'black', 
                'stroke-width': 5, 
                'stroke-linejoin': 'round', 
                'stroke-linecap': 'round', 
                transform: 'rotate(-45)'
            });

            container.appendChild(line);
            container.appendChild(target);

            return container;
        }

        static make_SVG(tag, attrs) {
            var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var id in attrs) {
                element.setAttribute(id, attrs[id]);
            }
            return element;
        }
    }

    return Template;
});
