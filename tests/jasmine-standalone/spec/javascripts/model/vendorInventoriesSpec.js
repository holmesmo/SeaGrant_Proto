describe('SeaGrant_Proto.model.VendorInventories', function() {

    var model;

    beforeEach(function() {
        //Set up test resources
        expect(model).toBeUndefined();
    });

    afterEach(function() {
        //Dispose of test resources
        model = model.destroy();
    });

    it('exists', function() {
        model = Ext.create('SeaGrant_Proto.model.VendorInventories');
        expect(model.$className).toEqual('SeaGrant_Proto.model.VendorInventories');
    });

    it('stores profile data on the vendor\'s inventory', function() {
        //Test model fields
        model = Ext.create('SeaGrant_Proto.model.VendorInventories',{
            name: 'Test Product Instance',
            preparation: 'Test prep'
        });
        
        //Justin will expect these to be moved into a helper function.
        //Please see Justin if you have questions.
        expect(model.get('name')).toEqual('Test Product Instance');
        expect(model.get('preparation')).toEqual('Test prep');          
    });
});
