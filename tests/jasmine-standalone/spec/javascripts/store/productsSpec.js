describe('SeaGrant_Proto.store.Product',function() {

    var store;

    beforeEach(function() {
        //Set up globals
        expect(store).toBeUndefined();
    });

    afterEach(function() {
        //Take down globals

        //This looks like it should be leaky, check the sencha API for
        //something like the model.destroy() function.
        store = null;
    });


    it('exists', function() {
        store = Ext.create('SeaGrant_Proto.store.Product');
        expect(store.$className).toEqual('SeaGrant_Proto.store.Product');
    });

    it('automatically populates itself with API data', function() {
        store = Ext.create('SeaGrant_Proto.store.Product');
        //Let's test this with sample data.
        expect(store.data.length).toBeGreaterThan(0);
    });
});
