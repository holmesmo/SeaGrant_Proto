Ext.define('SeaGrant_Proto.store.Vendor', {
	extend: 'Ext.data.Store',
	config: {
		model: 'SeaGrant_Proto.model.Vendors',
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '/newVendors.json',
			noCache: false,
			reader: {
				type: 'json',
				rootProperty: 'vendors'
			}
		}
	}
});
