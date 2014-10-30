Ext.define('SeaGrant_Proto.store.VendorInventory', {
    extend: 'Ext.data.Store',
    storeId: 'VendorInventory',
 
    config: {
        model: 'SeaGrant_Proto.model.VendorInventories',
        data: [
            {
                "name": "test Fish",
                "preparation": "Skewered"
            },
            {
                "name": "other Fish",
                "preparation": "new"
            }
        ]
    }
});
