describe('SeaGrant_Proto.model.Vendors', function() {

    var model;

    beforeEach(function() {
        //Set up globals
        expect(model).toBeUndefined();
    });

    afterEach(function() {
        //Take down globals
        model.destroy();
    });

    it('exists', function() {
        model = Ext.create('SeaGrant_Proto.model.Vendors');
        expect(model.$className).toEqual('SeaGrant_Proto.model.Vendors');
    });

    it('stores profile data on vendors', function() {
        //Test model fields
    });
});
