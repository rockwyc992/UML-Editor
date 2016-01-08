require.config({
    baseUrl: '../js',
    paths: {
        jquery: 'lib/jquery-2.1.4.min',
        Tab: 'Tab',
        Button: 'Button',
        Editor: 'Editor',
        qunit: '../test/qunit-1.20.0',
        test: '../test/test'
    },
    shim: {
        'qunit': {
            exports: 'qunit',
            init: function() {
                qunit.config.autoload = false;
                qunit.config.autostart = false;
            }
        } 
    }
});

require(['qunit', 'jquery', 'test'], function(qunit, $, Test) {
    Test.run();

    qunit.load();
    qunit.start();
});

