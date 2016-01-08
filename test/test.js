define(['Tab', 'Button', 'Editor/main'], function(Tab, Button, Editor) {
    var Test = function() {
    }

    Test.run = function() {
        /*
           var editor = new Editor();
           var tabs = new Tab(editor);
           var buttons = new Button(editor);
        */
        module('UML Editor Test');

        test('1=1', function() {
            equal(1, 1);
        });
    }

    return Test;
});
