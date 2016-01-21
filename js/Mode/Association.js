'use strict'

define(['Mode/Line'], function(Line) {
    class Association extends Line {
        constructor(mode, canvas, template) {
            super(mode, canvas, canvas.temp_line['association'], template.get_line.bind(null, 'association'));
        }
    }
    
    return Association;
});


