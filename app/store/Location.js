Ext.define('SeaGrant_Proto.store.Location', {
	extend: 'Ext.data.Store',
	config: {
		model: 'SeaGrant_Proto.model.Locations',
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '/newLocations.json',
			noCache: false,
			reader: {
				type: 'json',
				rootProperty: 'locations'
			}
		}
	}
});
