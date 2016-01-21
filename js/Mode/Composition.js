'use strict'

define(['Mode/Line'], function(Line) {
    class Composition extends Line {
        constructor(mode, canvas, template) {
            super(mode, canvas, canvas.temp_line['composition'], template.get_line.bind(null, 'composition'));
        }
    }
    
    return Composition;
});


