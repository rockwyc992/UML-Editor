require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery-2.1.4.min',
        Tab: 'Tab',
        Button: 'Button',
        Editor: 'Editor'
    }
});

require(['jquery'], function($) {
    require(['Tab', 'Button'], function(Tab, Button) {
        require(['Editor/main'], function(Editor) {
            var editor = new Editor();
            var tabs = new Tab(editor);
            var buttons = new Button(editor);
        });
    });
});
