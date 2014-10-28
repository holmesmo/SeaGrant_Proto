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
    onSetUseLocation: function(index, record){
	console.log('In controller(home): User Location toggle');
	console.log(record);
	console.log(record._component._value[0]);
	
	if(record._component._value[0] === 1){
	    // This updates the user's location and how far from their
            // location they would like to search for vendors/products

            // This is not the correct 'record' object - this is the
            // toggle field.
		    onSetDistance(record);
		    Ext.device.Geolocation.watchPosition({
			frequency: 3000, // Update every 3 seconds
			callback: function(position) {
			    console.log('Position updated!', position.coords);
			    // console.log(index._items.items[2]._value.data.val);
			    var dist = index._items.items[2]._value.data.val;
			},
			failure: function() {
			    console.log('something went wrong!');
			}
		    });
	    
	}else{
	    Ext.device.Geolocation.clearWatch();
	}
    },
    onSetDistance: function(record){
	console.log("In controller(home): Distance from user chosen");
	// console.log(record._value.data.val);
	console.log(record);
	SeaGrant_Proto.dist = record._value.data.val;
    },
    onSortByVendorCommand: function(){
	console.log('In controller(home): Vendor checkbox');
    },
    onSortByProductCommand: function(){
	console.log('In controller(home): Product checkbox');
    },
    onChooseLocation: function(record){
	// We first check to see if a location is chosen, if one is we sort by locataion,
	// then we check to see if a product is chosen, if one is we sort by product
	console.log('In controller(home): Drop Down list Location');
	// console.log(record);
	// console.log(index);
	// console.log(this);
	SeaGrant_Proto.location = record._value.data.title;
	// console.log('Location is: '+ location);
	// ALL FILTERS ONLY TAKE STRINGS, NONE WORK WITH VARABLES
	// THAT ARE SELECTED USING DROP DOWN TABLES, EVEN TOSTRING()
	// FUNCTION WILL NOT WORK
	var store = Ext.data.StoreManager.lookup('Vendor');
	if(SeaGrant_Proto.location !== 'Please choose a location'){
	    var locationfilter = new Ext.util.Filter({
		filterFn: function(item, record){
		    return item.get('city') === SeaGrant_Proto.location;
		},
		root: 'data'
	    });
	    store.clearFilter(); // this is the fix
	    store.filter(locationfilter); //now it works
	}else{
	    store.clearFilter();
	}
	if(SeaGrant_Proto.product !== 'Please choose a product'){
	    // console.log('IN PROD FILTER');
	    var prodFilter = new Ext.util.Filter({
		filterFn: function(item, record){
		    for(b = 0; b < item.data.products.length; b++){ // cycles through the vendor's products
			// console.log(b+'  '+item.data.products[b].name);
			if(item.data.products[b].name === SeaGrant_Proto.product){ // returns true for vendors with selected product
			    // console.log(item.data.products[b].name);
			    // console.log(SeaGrant_Proto.product);
			    return item.data.products[b].name === SeaGrant_Proto.product;
			}
		    }				
		},
		root: 'data'
	    });
	    store.filter(prodFilter);
	}
	
	// THIS FINDS THE NUMBER OF VENDORS AFTER THE SORT
	// NEEDED TO SET MAP MARKERS IN ONGOBUTTONCOMMAND
	SeaGrant_Proto.Litem = new Array();
	SeaGrant_Proto.VstoreLength = store.data.items.length;
	for (j = 0; j < store.data.items.length; j++){
	    SeaGrant_Proto.Litem[j] = store.data.items[j].data;			
	    // console.log(SeaGrant_Proto.Litem[j]);
	}

	var homeView = this.getHomeView();

        homeView.getComponent('vendnum').setData( this.buildInventorySummary(SeaGrant_Proto) );

	Ext.Viewport.setActiveItem(homeView);
    },
    onChooseProduct: function(index, record){
	// We first check to see if a location is chosen, if one is we sort by locataion,
	// then we check to see if a product is chosen, if one is we sort by product
	console.log('In controller(home): Drop Down list Products');
	// console.log(record);
	console.log('Product is: '+ record._value.data.name); 
	SeaGrant_Proto.product = record._value.data.name;
	var store = Ext.data.StoreManager.lookup('Vendor');
	// console.log(store.data.all);
	var len = store.data.all.length;
	// console.log(store);
	if(SeaGrant_Proto.location !== 'Please choose a location'){
	    // console.log('IN LOC FILTER');
	    var locationfilter = new Ext.util.Filter({
		filterFn: function(item, record){
		    return item.get('city') === SeaGrant_Proto.location;
		},
		root: 'data'
	    });
	    store.clearFilter();
	    store.filter(locationfilter);
	} else{
	    store.clearFilter();
	}
	if(SeaGrant_Proto.product !== 'Please choose a product'){
	    var prodFilter = new Ext.util.Filter({
		filterFn: function(item, record){
		    for(b = 0; b < item.data.products.length; b++){ // cycles through the vendor's products
			// console.log(b+'  '+item.data.products[b].name);
			if(item.data.products[b].name === SeaGrant_Proto.product){ // returns true for vendors with selected product
			    return item.data.products[b].name === SeaGrant_Proto.product;
			}
		    }				
		},
		root: 'data'
	    });		
	    store.filter(prodFilter);
	}

	var homeView = this.getHomeView();
        
        homeView.getComponent('vendnum').setData( this.buildInventorySummary(SeaGrant_Proto) );

	Ext.Viewport.setActiveItem(homeView);
    },

    // Home Controller Helper Functions
    buildInventorySummary: function(sourceObject){

        var vendors = Ext.data.StoreManager.lookup('Vendor');

        console.log("inside buildInventorySummary");
        var summary = {
            th: "There are ",
            numItems: vendors.getCount(),
            v: " vendors ",
            i: "in ",
            loc: "the database",
            end: "."
        };
        
        // Location/City is specified:
        // "There are <number> vendors near <location>."
        if (sourceObject.location !== "Please choose a location"){
            summary.i = "near ";
            summary.loc = sourceObject.location;
        }

        // Product is specified:
        // "There are <number> vendors ... with <product>."
        if (sourceObject.product !== "Please choose a product"){
            summary.w = " with ";
            summary.prod = SeaGrant_Proto.product;
        }

        return summary;
    }

});
