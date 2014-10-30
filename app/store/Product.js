Ext.define('SeaGrant_Proto.store.Product', {
	extend: 'Ext.data.Store',
	config: {
		model: 'SeaGrant_Proto.model.Products',
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '/newProducts.json',
			noCache: false,
			reader: {
				type: 'json',
				rootProperty: 'products'
			}
		}
	}
});
