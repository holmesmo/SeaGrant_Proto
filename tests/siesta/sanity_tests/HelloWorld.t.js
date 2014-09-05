StartTest(function(test) {
	test.diag("Inside Hello");


// var myPage = Ext.create("Ext.form.Panel",{
//     config: {
//       items: [
//         {
//           xtype: 'toolbar',
//           text: 'header',
//           dock: 'top'
//         },
//         {
//           xtype: 'togglefield',
//           label: 'Use current location'
//         }
//       ],
//       renderTo: Ext.getBody()
//     }
//   });

//   console.log(myPage);
//   console.log(myPage.config.config.items[1]);
//   var myToggle = myPage.config.config.items[1];
//   var myHeader = myPage.config.config.items[0];


//   test.diag("Created toggle");
//   // test.diag(toString(Ext.ComponentQuery.query("toolbar")));
//  //  test.click(myToggle);
 
//  //   
//   test.type(myPage, 'Hello world', function() {
//       test.is(myToggle.xtype, 'togglefield', 'Toggle exists.');
//   });
//   // console.log(myTextField);
//   console.log(myHeader.text);
//   test.diag('crud that should be here');
//   test.type(myPage, 'Hello world', function() {
//       test.is(myHeader.text, 'header', 'We have a header.');
//   });    



//########################################################
// this is the second structure that actually draws the 
// toggle slider


	// Instantiating page elements to be tested
  	var myHeader = Ext.create("Ext.Toolbar", {
  		xtype: 'toolbar',
	  	title: 'Header',
	  	dock: 'top',
	  	renderTo: Ext.getBody()
	});

	var myToggle = Ext.create("Ext.slider.Toggle", {
	    label: 'Use Current Location',
	    renderTo : Ext.getBody()
	});

	var myField = Ext.create("Ext.form.FieldSet",{
		xtype: 'fieldset',
            items: [
                {
                    xtype: 'selectfield',
                    label: 'Choose one',
                    options: [
                        {text: 'First Option',  value: 'first'},
                        {text: 'Second Option', value: 'second'},
                        {text: 'Third Option',  value: 'third'}
                    ]
                },
                {
					xtype: 'selectfield',			
					// itemId: 'id',
					label: 'Location',
					// labelWrap: true,
					// displayfield: 'id',
					// store: 'stuff',
					// valuefield: 'id'
				},				
                {
					xtype: 'selectfield',			
					// itemId: 'id',
					label: 'Product',
					// labelWrap: true,
					// displayfield: 'id',
					// store: 'stuff',
					// valuefield: 'id'
				}					
            ],
            renderTo: Ext.getBody()	      
	});

	var myButton = Ext.create("Ext.Button", {
	  	xtype: 'button',
		ui: 'action',
		text: 'Go',
		itemId: 'goButton',
	    renderTo : Ext.getBody()
	});
  // Uses the format of a sencha doc
  

	  // Toggle test
	test.diag("Created toggle");
	test.click(myToggle);
	console.log(myToggle.getValue());
	console.log(myToggle);
	test.type(myToggle, 'Hello world', function() {
	    test.is(myToggle.getValue(), '0', 'Toggle is tapped.');
	});
	// Button test
	test.diag("Created button");
	test.click(myButton);
	console.log(myButton);
	console.log(myButton._itemId);
	test.type(myButton, 'Hello world', function() {
	    test.is(myButton._itemId, 'goButton', 'Button exists.');
	});
	// Header test
	console.log(myHeader);
	console.log(myHeader.config.title);
	test.type(myHeader, 'Hello world', function() {
	    test.is(myHeader.config.title, 'Header', 'We have a header.');
	});
});