StartTest(function(t) {

    t.chain(
        { 
            waitFor : 'CQ', 
            args    : 'Home',
            desc    : 'Should find login view on app start'
        },

        function(next) {
            t.ok(t.cq1('#goButton'), 'Should find a login button');
        }
    );
});