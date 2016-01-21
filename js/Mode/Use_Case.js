'use strict'

define(['Mode/Basic'], function(Basic) {
    class Use_Case extends Basic {
        constructor(mode, editor, template) {
            super(mode, editor, template.get_element.bind(null, 'use_case'));
        }
    }
    
    return Use_Case;
});

