StartTest(function(t) {
    t.diag("Specific Page Tests");

    // Header test 
    var tool = Ext.ComponentQuery.query('toolbar');
    // console.log('This is the toolbar: ');
    // console.log(tool);
    t.is(tool[4].config.itemId, 'specificPageToolbar', "We have a Header");

    // Back button test
    var Bbtn = Ext.ComponentQuery.query('button[itemId=backInfoButton]');
    // console.log("Here is Bbtn: ");
    // console.log(Bbtn[0]);
    t.click(Bbtn);
    // Check that button exists
    t.is(Bbtn[0]._itemId, 'backInfoButton', 'We have a back button to info page');
    // Now check that button fires correct event to controller
    t.is(Bbtn[0].eventDispatcher.listenerStacks.component.specific.viewBackInfoCommand.listeners.current[0].fn.$name, 'onViewBackInfoCommand', 'The Back button sends us to the Info page.');

    // Data displayed test
    

    t.done();   // Optional, marks the correct exit point from the test
});  