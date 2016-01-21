'use strict'

define(['Mode/Basic'], function(Basic) {
    class Class extends Basic {
        constructor(mode, editor, template) {
            super(mode, editor, template.get_element.bind(null, 'class'));
        }
    }
    
    return Class;
});

