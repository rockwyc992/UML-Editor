'use strict';

require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery-2.1.4.min',
    }
});

require(['jquery'], function($) {
    require(['Tab', 'Button'], function(Tab, Button) {
        require(['Editor'], function(Editor) {
            var editor = new Editor();
            var tabs = new Tab(editor);
            var buttons = new Button(editor);
        });
    });
});
