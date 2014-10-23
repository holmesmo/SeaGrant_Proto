Ext.define('SeaGrant_Proto.controller.Home', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.MessageBox', 'Ext.device.Geolocation'],
    config: {
	refs: {
	    homeView: 'home',
	},
	control: {
	    homeView: {				
		setUseLocation: 'onSetUseLocation',
		setDistance: 'onSetDistance',
		chosenLocation: 'onChooseLocation',
		chosenProduct: 'onChooseProduct',
		sortByVendorCommand: 'onSortByVendorCommand',
		sortByProductCommand: 'onSortByProductCommand',
		viewGoCommand: 'onViewGoCommand'				
	    }
	}
    },

    // Controller setup
    launch: function(){
	this.callParent(arguments);
	console.log("launch");
    },
    init: function(){
	this.callParent(arguments);
	console.log("init");
    },

    // Home page controls
    onSortByVendorCommand: function(){
	console.log('In controller(home): Vendor checkbox');
    },
    onSortByProductCommand: function(){
	console.log('In controller(home): Product checkbox');
    },
});
