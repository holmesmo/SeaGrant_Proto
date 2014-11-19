var isPresent;
isPresent = true;


Ext.define('SeaGrant_Proto.controller.List', {
	extend: 'Ext.app.Controller',
	// Note: Ext.device.Geolocation breaks jasmine testing by giving us a synchronous loading issue
	requires: ['Ext.MessageBox'], 
	// 'Ext.device.Geolocation'],
	alias: 'cont',
	config: {
		refs: {
			homeView: 'home',
			listView: 'listview',
			detailView: 'detail',
			productdetailView: 'productdetail',			
			infoView: 'info',
			specificView: 'specific'
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
			},
			listView: {
				viewBackHomeCommand: 'onViewBackHomeCommand',
				viewDetailCommand: 'onViewDetailCommand',
				viewLpageListHighlightCommand: 'onViewLpageListHighlightCommand',
				viewLpageListItemCommand: 'onViewLpageListItemCommand'
			},
			detailView: {
				viewBackListCommand: 'onViewBackListCommand',
				viewInfoCommand: 'onViewInfoCommand',
				viewDpageListItemCommand: 'onViewDpageListItemCommand'
			},
			productdetailView: {
				viewBackListCommand: 'onViewBackListCommand',
				viewInfoCommand: 'onViewInfoCommand',
				viewDpageListItemCommand: 'onViewDpageListItemCommand'
			},
			infoView: {
				viewBackDetailCommand: 'onViewBackDetailCommand',
				viewSpecificCommand: 'onViewSpecificCommand',
				viewIpageListItemCommand: 'onViewIpageListItemCommand'
			},
			specificView: {
				viewBackInfoCommand: 'onViewBackInfoCommand'
			}
		}
	},
	slideLeftTransition: {
		type: 'slide',
		direction: 'left' 
	},
	slideRightTransition: {
		type: 'slide',
		direction: 'right'
	},
	// Functions dealing with 
	// HOME
	// stuff	######################################################################################	HOME
	onSetUseLocation: function(index, record){
		console.log('In controller(home): User Location toggle');
		console.log(record);
		console.log(record._component._value[0]);
		
		if(record._component._value[0] === 1){
			// This updates the user's location and how far from their location they would like to search for vendors/products
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
	// This function may be unnecessary due to the fact that we set the distance in the callback function above
	onSetDistance: function(index, record){
		console.log("In controller(home): Distance from user chosen");
		// console.log(record._value.data.val);
		console.log('record ' + record);
		SeaGrant_Proto.dist = record._value.data.val;
	},
	onChooseLocation: function(index, record){
		// We first check to see if a location is chosen, if one is we sort by locataion,
		// then we check to see if a product is chosen, if one is we sort by product
		console.log('In controller(home): Drop Down list Location');
		// var loc = this.getHomeView();
		// console.log(record);
		// console.log(index);
		// console.log(this);
		SeaGrant_Proto.location = record._value.data.title;
		console.log('Location is: '+ SeaGrant_Proto.location +'\n'); 
		// ALL FILTERS ONLY TAKE STRINGS, NONE WORK WITH VARABLES
		// THAT ARE SELECTED USING DROP DOWN TABLES, EVEN TOSTRING()
		// FUNCTION WILL NOT WORK
		var store = Ext.data.StoreManager.lookup('Vendor');
		var pstore = Ext.data.StoreManager.lookup('ProductList');
		// OLD DATA THAT WORKED TO FILTER BY LOCATION ONLY
		// var locationfilter = new Ext.util.Filter({
		// 	filterFn: function(item, record){
		// 		return item.get('city') === SeaGrant_Proto.location;
		// 	},
		// 	root: 'data'
		// });
		// store.clearFilter(); // this is the fix
		// store.filter(locationfilter); //now it works
		
		var len = store.data.all.length;
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
		var view = this.getListView();
		if(SeaGrant_Proto.product !== 'Please choose a product'){
			
			view.down('list').setStore(pstore);
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
			// pstore is populated with items from selected vendor
			var countLen = 0;
			var flag = 0;
			var addVendor;
			var newNum = 0;
			pstore.removeAll();
			for(i = 0; i < store.data.items.length; i++){
				for(j = 0; j < store.data.items[i].data.products.length; j++){
					flag = 0;
					for(k = 0; k < pstore.data.length; k++){
						// check to see if product and prep already exist
						if((store.data.items[i].data.products[j].name === pstore.data.items[k].data.name) && (store.data.items[i].data.products[j].preparation === pstore.data.items[k].data.preparation)){
							addVendor = store.data.items[i].data.name;
							newNum = k;
							flag = 1;
						}					
					}
					// if prod/prep exist, add a new vendor to the vendors list
					if(flag === 1){
						pstore.data.items[newNum].data.vendors.push(addVendor);
					}
					// if the prod/prep DNE, then creat a new product from the current vendor as long as its name is same as chosen product name
					if((flag === 0) && (store.data.items[i].data.products[j].name === SeaGrant_Proto.product)){
						var newpro = {
							name: store.data.items[i].data.products[j].name, 
							preparation: store.data.items[i].data.products[j].preparation,
							vendors: [store.data.items[i].data.name]
						};
						pstore.add(newpro);
					}
				}
			}	
		}else{
			// console.log('vendor store set');
			view.down('list').setStore(store);
		}
		
		// THIS FINDS THE NUMBER OF VENDORS AFTER THE SORT
		// NEEDED TO SET MAP MARKERS IN ONGOBUTTONCOMMAND
		SeaGrant_Proto.Litem = new Array();

		SeaGrant_Proto.VstoreLength = store.data.items.length;
		// console.log(store.data.items);
		for (j = 0; j < store.data.items.length; j++){
			SeaGrant_Proto.Litem[j] = store.data.items[j].data;			
			// console.log(SeaGrant_Proto.Litem[j]);
		}


		SeaGrant_Proto.vendcount;
		// console.log(vendcount);
		var homeView = this.getHomeView();
		// console.log('this');
		// console.log(this);
		// console.log(homeView);
		var crud = homeView.getComponent('vendnum'); // gets our display item in from the home page
		// console.log(crud);
		// This defines how the tpl data is printed out given the drop down table states
		if ((SeaGrant_Proto.location !== 'Please choose a location') || (SeaGrant_Proto.product !== 'Please choose a product')){
			if(SeaGrant_Proto.location === 'Please choose a location'){
					SeaGrant_Proto.vendcount = {
						th: 'There are ',
						numItems: store.getCount(),
						v: ' vendors ',
						w: ' with ',
						prod: SeaGrant_Proto.product,
						end: '.'			
					};
			}else{
				if (SeaGrant_Proto.product !== 'Please choose a product'){
					// console.log('Prod ok');
					SeaGrant_Proto.vendcount = {
						th: 'There are ',
						numItems: store.getCount(),
						v: ' vendors ',
						i: 'in ',
						loc: SeaGrant_Proto.location,
						w: ' with ',
						prod: SeaGrant_Proto.product,
						end: '.'			
					};
				}else{
					// console.log('Prod is horid');
					SeaGrant_Proto.vendcount = {
						th: 'There are ',
						numItems: store.getCount(),
						v: ' vendors ',
						i: 'in ',
						loc: SeaGrant_Proto.location,
						end: '.'			
					};
				}
			}			
		}
		crud.setData(SeaGrant_Proto.vendcount); // needed to display tpl data on home view
		Ext.Viewport.setActiveItem(homeView);
	},
	onChooseProduct: function(index, record){
		// We first check to see if a location is chosen, if one is we sort by locataion,
		// then we check to see if a product is chosen, if one is we sort by product
		console.log('In controller(home): Drop Down list Products');
		// console.log(record);
		console.log('Product is: '+ record._value.data.name +'\n'); 
		SeaGrant_Proto.product = record._value.data.name;
		var store = Ext.data.StoreManager.lookup('Vendor');
		var pstore = Ext.data.StoreManager.lookup('ProductList');
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
		}else{
			
			store.clearFilter();
		}
		var view = this.getListView();
		if(SeaGrant_Proto.product !== 'Please choose a product'){
			
			view.down('list').setStore(pstore);
			var prodFilter = new Ext.util.Filter({
				filterFn: function(item, record){
					for(b = 0; b < item.data.products.length; b++){ // cycles through the vendor's products// console.log(b+'  '+item.data.products[b].name);
						if(item.data.products[b].name === SeaGrant_Proto.product){ // returns true for vendors with selected product
							return item.data.products[b].name === SeaGrant_Proto.product;
						}
					}				
				},
				root: 'data'
			});
			store.filter(prodFilter);
			// pstore is populated with items from selected vendor
			var countLen = 0;
			var flag = 0;
			var addVendor;
			var newNum = 0;
			pstore.removeAll();
			for(i = 0; i < store.data.items.length; i++){
				for(j = 0; j < store.data.items[i].data.products.length; j++){
					flag = 0;
					for(k = 0; k < pstore.data.length; k++){
						// check to see if product and prep already exist
						if((store.data.items[i].data.products[j].name === pstore.data.items[k].data.name) && (store.data.items[i].data.products[j].preparation === pstore.data.items[k].data.preparation)){
							addVendor = store.data.items[i].data.name;
							newNum = k;
							flag = 1;
						}					
					}
					// if prod/prep exist, add a new vendor to the vendors list
					if(flag === 1){
						pstore.data.items[newNum].data.vendors.push(addVendor);
					}
					// if the prod/prep DNE, then creat a new product from the current vendor as long as its name is same as chosen product name
					if((flag === 0) && (store.data.items[i].data.products[j].name === SeaGrant_Proto.product)){
						var newpro = {
							name: store.data.items[i].data.products[j].name, 
							preparation: store.data.items[i].data.products[j].preparation,
							vendors:[store.data.items[i].data.name]
						};
						pstore.add(newpro);
					}
				}
			}	
		}else{
			// console.log('vendor store set');
			view.down('list').setStore(store);
		}

		// NEEDED TO SET MAP MARKERS IN ONGOBUTTONCOMMAND
		SeaGrant_Proto.Litem = new Array();
		SeaGrant_Proto.VstoreLength = store.data.items.length;
		// console.log(store.data.items);
		for (j = 0; j < store.data.items.length; j++){
			SeaGrant_Proto.Litem[j] = store.data.items[j].data;			
			// console.log(SeaGrant_Proto.Litem[j]);
		}

		var homeView = this.getHomeView();
		var crud = homeView.getComponent('vendnum'); // gets our display item in from the home page
		SeaGrant_Proto.vendcount;
		// This defines how the tpl data is printed out given the drop down table states
		if ((SeaGrant_Proto.location !== 'Please choose a location') || (SeaGrant_Proto.product !== 'Please choose a product')){
			if(SeaGrant_Proto.product === 'Please choose a product'){
					SeaGrant_Proto.vendcount = {
						th: 'There are ',
						numItems: store.getCount(),
						v: ' vendors ',
						i: 'in ',
						loc: SeaGrant_Proto.location,
						end: '.'			
					};
			}else{
				if(SeaGrant_Proto.location !== 'Please choose a location'){
					console.log('Prod ok');
					SeaGrant_Proto.vendcount = {
						th: 'There are ',
						numItems: store.getCount(),
						v: ' vendors ',
						i: 'in ',
						loc: SeaGrant_Proto.location,
						w: ' with ',
						prod: SeaGrant_Proto.product,
						end: '.'			
					};
				}else{
					console.log('Prod is horid');
					SeaGrant_Proto.vendcount = {
						th: 'There are ',
						numItems: store.getCount(),
						v: ' vendors ',
						w: ' with ',
						prod: SeaGrant_Proto.product,
						end: '.'			
					};
				}
			}
			
		}
		crud.setData(SeaGrant_Proto.vendcount); // needed to display tpl data on home view
		Ext.Viewport.setActiveItem(homeView);
	},	
	onSortByVendorCommand: function(){
		console.log('In controller(home): Vendor checkbox');
	},
	onSortByProductCommand: function(){
		console.log('In controller(home): Product checkbox');
	},
	onViewGoCommand: function(){
		console.log('In controller(home): Go to List Page Button');	
		SeaGrant_Proto.iconImage = '/images/red.png';	
		this.addMapMarkers();
		setTimeout(function() {
           SeaGrant_Proto.gMap.panTo(SeaGrant_Proto.cent[0]);
           		SeaGrant_Proto.gMap.fitBounds(SeaGrant_Proto.bounds);
           		// these statements make sure that our zoom is not to close or to far away from the marker
           		if(SeaGrant_Proto.gMap.getZoom() > 15){
					SeaGrant_Proto.gMap.setZoom(15);
				}
				if(SeaGrant_Proto.gMap.getZoom() < 6){
					SeaGrant_Proto.gMap.setZoom(6);
				}
        }, 1000);
        SeaGrant_Proto.path[SeaGrant_Proto.pcount] = 'list';
        SeaGrant_Proto.pcount = ++SeaGrant_Proto.pcount;
        Ext.Viewport.animateActiveItem(this.getListView(), this.slideLeftTransition);
	},
	// Functions dealing with 
	// LIST
	// stuff	######################################################################################	LIST
	onViewBackHomeCommand: function(){
		console.log('In controller(list): Back to Home Page Button');
		// This removes the old markers from the map on the list page
		for(i = 0; i < SeaGrant_Proto.marker.length; i++){
			SeaGrant_Proto.marker[i].setMap(null);
		}
		SeaGrant_Proto.marker.length = 0;		
		var listItems = this.getListView();
		listItems._items.items[2].deselect(listItems._items.items[2].selected.items[0]);		
		Ext.Viewport.animateActiveItem(this.getHomeView(), this.slideRightTransition);
	},
	onViewDetailCommand: function(){
		console.log('In controller(list): View Detail Page Button');
		Ext.Viewport.animateActiveItem(this.getDetailView(), this.slideLeftTransition);
	},		
	// declareMap markers and infowindows as well as functions for the listview map
	addMapMarkers: function(){
		var self = this; // important to get the correct data to the viewport
		SeaGrant_Proto.infoClickSelf = self;
		// Variables for setting marker attributes
		SeaGrant_Proto.lastI = null;
		SeaGrant_Proto.lastNodeSet = new Array();
		SeaGrant_Proto.lastNodeSet[0] = null;
		SeaGrant_Proto.lent = 0;
		SeaGrant_Proto.animation = null;
		// SeaGrant_Proto.opnum = 0.7;
		var lat;
		var lng;
		SeaGrant_Proto.infowindow = new google.maps.InfoWindow();
		SeaGrant_Proto.marker = new Array();
		SeaGrant_Proto.cent = new Array();
		SeaGrant_Proto.bounds = new google.maps.LatLngBounds();
		for (k = 0; k < SeaGrant_Proto.VstoreLength; k++){
			lat = SeaGrant_Proto.Litem[k].lat;
			// console.log(lat);
			lng = SeaGrant_Proto.Litem[k].lng;
			// console.log(lng);
			SeaGrant_Proto.cent[k] = new google.maps.LatLng(lat, lng);
			//THIS IS THE BLOCK OF CODE THAT USES THE MARKER AS AN ARRAY
			// THIS FUNCTION CREATES EACH LIST ITEM MARKER
			this.addAMapMarker(k, SeaGrant_Proto.animation);
        	// This gets the map bounds based on the markers
        	SeaGrant_Proto.bounds.extend(SeaGrant_Proto.marker[k].position);
        	
		}
	},
	addAMapMarker: function(k, animation){
		// I moved all of the code to create a single map marker with an infowindow and listener for that window
		// out of the add map markers function in order to use it in the onViewLpageListHighlightCommand
		SeaGrant_Proto.marker[k] = new google.maps.Marker({
				map: SeaGrant_Proto.gMap,
				animation: animation,
				// opacity: opnum,
				// zIndex: google.maps.Marker.MAX_ZINDEX + 1,
				icon: SeaGrant_Proto.iconImage,
				position: SeaGrant_Proto.cent[k],
				clickable: true
			});			
			// THIS FUNCTION ADDS A CLICKABLE MARKER INFO WINDOW FOR EACH SPECIFIC MARKER
        	SeaGrant_Proto.marker[k].info = new google.maps.InfoWindow({
        		content: '<button onclick=\"javascript:SeaGrant_Proto.infoClickSelf.onInfoWindowClick();\">'+ SeaGrant_Proto.Litem[k].name + '</button>',
        		data: SeaGrant_Proto.Litem[k],
        		Lpos: k // used to index and highlight the correct list item
        	});
        	// NOW WE ADD AN ON CLICK EVENT LISTENER TO EACH MARKER
        	// WE WILL USE THIS LISTENER TO OPEN THE SPECIFIC MARKER INFO THAT WAS CLICKED
        	google.maps.event.addListener(SeaGrant_Proto.marker[k], 'click', function(){
        		SeaGrant_Proto.storeItem = this;
        		// console.log('THIS IN THE EVENT LISTENER');
        		// console.log(this);
        		SeaGrant_Proto.infowindow.setContent(this.info.content); // this makes it so that only one info window is displayed at one time
        		SeaGrant_Proto.infowindow.open(SeaGrant_Proto.gMap, this); // this opens the infowindow defined above
        	});	
	},
	onInfoWindowClick: function(record, list, index){
		var lv = SeaGrant_Proto.infoClickSelf.getListView();
		lv._items.items[2].select(SeaGrant_Proto.storeItem.info.Lpos); // selects the list item coresponding to the map marker
		// note, "self" is the key, if I use "this" it will not refrence the correct data
		// THIS USES THE SAME DETAIL PAGE DATA POPULATING CODE THAT THE ON CLICK LIST ITEM EVENT DOES
		SeaGrant_Proto.infoClickSelf.onViewLpageListItemCommand(this, SeaGrant_Proto.infoClickSelf, SeaGrant_Proto.storeItem.info);
	},
	onViewLpageListHighlightCommand: function(record, list, index){
		var view = this.getListView();
		// console.log('list view');
		// console.log(view);
		var t = 0;
		var h;
		// THIS LOOP OPENS THE INFO PIN THAT CORESPONDS WITH THE SELETED LIST ITEM
		for(i = 0; i < SeaGrant_Proto.marker.length; i++){
			// console.log('SeaGrant_Proto.marker[i].info.data.id   '+ SeaGrant_Proto.marker[i].info.data.id +'   index.id   '+ index.id +'\n');
			// console.log('marker data   ');
			// console.log(SeaGrant_Proto.marker[i].icon);
			// console.log('Index');
			// console.log(index.data);
			if(view._items.items[2]._store._storeId === 'ProductList'){
				// Use this for loop to find all the vendors that sell this product
				for(j = 0; j < index.data.vendors.length; j++){					
					// this if statement finds vendors who carry the specific product
					if(SeaGrant_Proto.marker[i].info.data.name === index.data.vendors[j]){
						// check to make sure that we have a previous set of nodes to turn red again
						// also checks that we only reset the nodes once when we search for and change 
						// the new nodes for the new product to blue
						if((SeaGrant_Proto.lastNodeSet[0] != null) && (t == 0)){
							// console.log("removing last set of blue markers");
							// console.log("SeaGrant_Proto.lent = "+ SeaGrant_Proto.lent);
							for(h = 0; h < SeaGrant_Proto.lent; h++){
								// get rid of last blue marker
								SeaGrant_Proto.marker[SeaGrant_Proto.lastNodeSet[h]].setMap(null);
								// console.log('removed');
								// console.log(SeaGrant_Proto.lastNodeSet[h]);
								// reset marker to red
								SeaGrant_Proto.iconImage = '/images/red.png';
								// Setting the animation to null
								SeaGrant_Proto.animation = null;
								// Set the opacity of the pin
								// SeaGrant_Proto.opnum = 0.5;
								// remake the red marker
								this.addAMapMarker(SeaGrant_Proto.lastNodeSet[h], SeaGrant_Proto.animation, SeaGrant_Proto.opnum);
								// console.log('added');
								// reset t so that the new set of nodes for a product are populated
								t = 0;
							}
							SeaGrant_Proto.lent = 0;
				        }
				        // get rid of red marker for selected list item
				        SeaGrant_Proto.marker[i].setMap(null);
				        // reset marker to blue
						SeaGrant_Proto.iconImage = '/images/blue.png';
						// Setting the animation to drop
						SeaGrant_Proto.animation = google.maps.Animation.DROP;
						// Set the opacity of the pin
						// SeaGrant_Proto.opnum = 1.0;
						// make the blue marker
						this.addAMapMarker(i, SeaGrant_Proto.animation, SeaGrant_Proto.opnum);
						SeaGrant_Proto.marker[i].setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
						SeaGrant_Proto.lastNodeSet[t] = i;
			   			t = t+1;
			   			SeaGrant_Proto.lent = t;
					}
				}
			}
			if(view._items.items[2]._store._storeId === 'Vendor'){
				if(SeaGrant_Proto.marker[i].info.data.id === index.id){					
					// This is setting the pin of the selected list item to be blue and popping open its infowindow
					if(SeaGrant_Proto.lastI != null){
						// get rid of last blue marker
						SeaGrant_Proto.marker[SeaGrant_Proto.lastI].setMap(null);
						// reset marker to red
						SeaGrant_Proto.iconImage = '/images/red.png';
						SeaGrant_Proto.animation = null;
						// Set the opacity of the pin
						// SeaGrant_Proto.opnum = 0.5;
						// remake the red marker
						this.addAMapMarker(SeaGrant_Proto.lastI, SeaGrant_Proto.animation, SeaGrant_Proto.opnum);						
			        }
			        // get rid of red marker for selected list item
			        SeaGrant_Proto.marker[i].setMap(null);
			        // reset marker to blue
					SeaGrant_Proto.iconImage = '/images/blue.png';
					SeaGrant_Proto.animation = google.maps.Animation.DROP;
					// Set the opacity of the pin
					// SeaGrant_Proto.opnum = 1.0;
					// make the blue marker
					this.addAMapMarker(i, SeaGrant_Proto.animation, SeaGrant_Proto.opnum);
					SeaGrant_Proto.marker[i].setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
					// add data to blue marker info window and open it
					SeaGrant_Proto.infowindow.setContent(SeaGrant_Proto.marker[i].info.content); // sets the infowindow that coresponds to the selected list
			        SeaGrant_Proto.infowindow.open(SeaGrant_Proto.gMap, SeaGrant_Proto.marker[i]); // this opens the infowindow defined above
					SeaGrant_Proto.lastI = i;
			    }
			}
		}
	},		
	onViewLpageListItemCommand: function(record, list, index){
		console.log('In controller(list): Select list item');
		// Ext.Msg.alert(index.data.name, 'This is the selected list item.');
		
		var detailView = this.getDetailView();
		var productdetailView = this.getProductdetailView();
		
		detailView.getAt(1).setData(index.data);
		productdetailView.getAt(1).setData(index.data);
		// console.log('data that we need');
		// console.log(productdetailView.getAt(1)._data);
		// console.log(this);
		// console.log(productdetailView._items.items[1]._data);
		// console.log(detailView._items.items[1]._data);
		
		Ext.ComponentQuery.query('toolbar[itemId=productdetailPageToolbar]')[0].setTitle(index.data.name);
		Ext.ComponentQuery.query('toolbar[itemId=detailPageToolbar]')[0].setTitle(index.data.name);
		// Trying to pass product data from selected vendor to new store, so that we
		// can use the new store to correctly use tpl print to make selectable list 
		// items of each unique product.
				
		// Trying to find store so that we can add data to the new store.
		var storeInventory = Ext.data.StoreManager.lookup('VendorInventory');
		var productstore = Ext.data.StoreManager.lookup('Product');
		// console.log(stuff);
		// console.log('storeStuff Items: ');
		// console.log(storeStuff.data.items[0]);
		storeInventory.removeAll();
		// console.log(storeStuff.data.items);
		var view = this.getListView();
		// console.log('list view');
		// console.log(view);

		// THIS LOOP OPENS THE INFO PIN THAT CORESPONDS WITH THE SELECTED LIST ITEM
		// for(i = 0; i < SeaGrant_Proto.marker.length; i++){
		// 	if(SeaGrant_Proto.marker[i].info.data.id === index.id){
		// 		SeaGrant_Proto.infowindow.setContent(SeaGrant_Proto.marker[i].info.content); // sets the infowindow that coresponds to the selected list
		//         SeaGrant_Proto.infowindow.open(SeaGrant_Proto.gMap, SeaGrant_Proto.marker[i]); // this opens the infowindow defined above
		//     }
		// }
		this.onViewLpageListHighlightCommand(record, list, index);
		
		// console.log(index);
		if(view._items.items[2]._store._storeId === 'Vendor'){
			// Store is populated with items from selected vendor
			// console.log(index.data.products.length);
			for(i = 0; i < index.data.products.length; i++){
				var newpro = {
					name: index.data.products[i].name, 
					preparation: index.data.products[i].preparation
				};
				storeInventory.add(newpro);
			}
			// for stack that tracks navigaion
			SeaGrant_Proto.path[SeaGrant_Proto.pcount] = 'detail';
        	SeaGrant_Proto.pcount = ++SeaGrant_Proto.pcount;
			Ext.Viewport.animateActiveItem(detailView, this.slideLeftTransition);
		}
		if(view._items.items[2]._store._storeId === 'ProductList'){
			// console.log('going to productdetailView');
			// console.log(index);
			for(i = 0; i < index.data.vendors.length; i++){
				var newpro = {
					name: index.data.vendors[i]
				};
				storeInventory.add(newpro);
			}
			for(k = 0; k <  productstore.data.all.length; k++){
				// console.log('in k loop'+ k);
				// console.log(productstore.data.items[k]);
				if(productstore.data.all[k].data.name === index.data.name){
					// console.log(productstore.data.all[k].data.name);
					// console.log(index.data.name);
					// Sets data for the info block on productdetail page
					productdetailView.getAt(1).setData(productstore.data.all[k].data);
					// console.log('NEEDED DISPLAY DATA');
					// console.log(productdetailView.getAt(1)._data);  
				}
			}
			// for stack that tracks navigaion
			SeaGrant_Proto.path[SeaGrant_Proto.pcount] = 'productdetail';
        	SeaGrant_Proto.pcount = ++SeaGrant_Proto.pcount;
			Ext.Viewport.animateActiveItem(productdetailView, this.slideLeftTransition);
		}		
	},
	// Functions dealing with 
	// DETAIL
	// stuff	######################################################################################	DETAIL
	onViewBackListCommand: function(record, index){
		console.log('In controller(detail): Back to List Page Button');
		var store = Ext.data.StoreManager.lookup('Vendor');
		// console.log(record);
		// console.log(index);
		var len = store.data.all.length;
		if(SeaGrant_Proto.location != 'Please choose a location'){
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
		if(SeaGrant_Proto.product != 'Please choose a product'){
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
		Ext.Viewport.animateActiveItem(this.getListView(), this.slideRightTransition);
	},
	onViewInfoCommand: function(){
		console.log('In controller(detail): View Info Page Button');
		Ext.Viewport.animateActiveItem(this.getInfoView(), this.slideLeftTransition);
	},	
	onViewDpageListItemCommand: function(record, list, index){
		console.log('In controller(detail): Select list item');
		console.log(this);
		// Ext.Msg.alert(index.data.name, 'This is the selected list item.');
		var view = this.getListView();
		var detailView = this.getDetailView();
		var productdetailView = this.getProductdetailView();
		
		var storeInventory = Ext.data.StoreManager.lookup('VendorInventory');
		storeInventory.removeAll();
		var vendorstore = Ext.data.StoreManager.lookup('Vendor');
		// console.log(SeaGrant_Proto);
		// Check to see if we are currently on the detail page or productdetail page, so that we know how to deal
		// with our data selection
		if(SeaGrant_Proto.path[SeaGrant_Proto.pcount - 1] === 'detail'){
			// Store is populated with items from selected vendor
			console.log('we are going from the detail page to the productsdetail page');
			// console.log(vendorstore.data.items);
			var productstore = Ext.data.StoreManager.lookup('Product');
			// console.log(productstore.data.items);

			// search through the vendors to find the vendors who carry the product we are selecting, 
			// so that we can display the vendors that carry that product
			for(i = 0; i < vendorstore.data.all.length; i++){
				for(j = 0; j < vendorstore.data.all[i].data.products.length; j++){
					// populating the storeInventory with the vendors who sell the chosen product
					if((vendorstore.data.all[i].data.products[j].name === index.data.name) && (vendorstore.data.all[i].data.products[j].preparation === index.data.preparation)){

						var newpro = {
							name: vendorstore.data.all[i].data.name
						};
						storeInventory.add(newpro);
					}
					
				}
			}
			for(k = 0; k <  productstore.data.all.length; k++){
				// console.log('in k loop'+ k);
				// console.log(productstore.data.items[k]);
				if(productstore.data.all[k].data.name === index.data.name){
					// console.log(productstore.data.all[k].data.name);
					// console.log(index.data.name);
					// Sets data for the info block on productdetail page
					productdetailView.getAt(1).setData(productstore.data.all[k].data);
					console.log('NEEDED DISPLAY DATA');
					console.log(productdetailView.getAt(1)._data);  
				}
			}

			
			// console.log(index);
			SeaGrant_Proto.path[SeaGrant_Proto.pcount] = 'productdetail';
        	SeaGrant_Proto.pcount = ++SeaGrant_Proto.pcount;
			Ext.ComponentQuery.query('toolbar[itemId=productdetailPageToolbar]')[0].setTitle(index.data.name);
			Ext.Viewport.animateActiveItem(this.getProductdetailView(), this.slideLeftTransition);
		}else if(SeaGrant_Proto.path[SeaGrant_Proto.pcount - 1] === 'productdetail'){
			console.log('Leaving the productdetail page to see the detail page');
			// console.log(index);
			// console.log(vendorstore.data.items);


			// WE ALSO HAVE A PROBLEM WHERE THE TITLE OF THE INFO BLOCK IS NOT INCLUDING THE PROPER PREPARATION.



			// search through the vendors that carry the item and find the one we are selecting, 
			// so that we can use the data from the selected vendor
			for(i = 0; i < vendorstore.data.all.length; i++){
				if(vendorstore.data.all[i].data.name === index.data.name){
					// populating the storeInventory with the vendor's products
					for(j = 0; j < vendorstore.data.all[i].data.products.length; j++){
						var newpro = {
							name: vendorstore.data.all[i].data.products[j].name, 
							preparation: vendorstore.data.all[i].data.products[j].preparation
						};
						storeInventory.add(newpro); 
					}
					// Sets data for the info block on detail page
					detailView.getAt(1).setData(vendorstore.data.all[i].data);					
				}
			}
			// adding a log item to the "stack"
			SeaGrant_Proto.path[SeaGrant_Proto.pcount] = 'detail'; 
        	SeaGrant_Proto.pcount = ++SeaGrant_Proto.pcount;
        	// Sets the title of the header on detail page
			Ext.ComponentQuery.query('toolbar[itemId=detailPageToolbar]')[0].setTitle(index.data.name); 
			Ext.Viewport.animateActiveItem(this.getDetailView(), this.slideLeftTransition);
		}
	},
	// Functions dealing with 
	// INFO 
	// stuff	######################################################################################	INFO
	onViewBackDetailCommand: function(){
		console.log('In controller(info): Back to Detail Page Button');
		Ext.Viewport.animateActiveItem(this.getDetailView(), this.slideRightTransition);
	},
	onViewSpecificCommand: function(){
		console.log('In controller(info): View Specific Page Button');
		Ext.Viewport.animateActiveItem(this.getSpecificView(), this.slideLeftTransition);
	},	
	onViewIpageListItemCommand: function(record, list, index){
		console.log('In controller(info): Selected');
		// Ext.Msg.alert(index.data.listItem, 'This is the stuff I selected.');
		Ext.ComponentQuery.query('toolbar[itemId=specificPageToolbar]')[0].setTitle(index.data.listItem);
		Ext.Viewport.animateActiveItem(this.getSpecificView(), this.slideLeftTransition);
	},
	// Functions dealing with
	// SPECIFIC
	// stuff	######################################################################################	SPECIFIC
	onViewBackInfoCommand: function(){
		console.log('In controller(specific): Back to Info Page Button');
		Ext.Viewport.animateActiveItem(this.getInfoView(), this.slideRightTransition);
	},
	// Initialize functions
	launch: function(){
		this.callParent(arguments);
		console.log("launch");
	},
	init: function(){
		this.callParent(arguments);
		SeaGrant_Proto.path = [];
		SeaGrant_Proto.pcount = 0;
		// console.log("init");
	}
});
