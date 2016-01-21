'use strict'

define(['Mode/Line'], function(Line) {
    class Generalization extends Line {
        constructor(mode, canvas, template) {
            super(mode, canvas, canvas.temp_line['generalization'], template.get_line.bind(null, 'generalization'));
        }
    }
    
    return Generalization;
});


