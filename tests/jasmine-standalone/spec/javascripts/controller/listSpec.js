// Test suite is pending. It may be re-enabled by changing "xdescribe()"
// to "describe()"

describe('SeaGrant_Proto.controller.List',function() {

    // this is not neccisary, it adds the errors at the bottom of the console.logs
    Ext.require('SeaGrant_Proto.controller.List');

    var controller, app;
    var thing, rec, store, homeView;
 
    beforeEach(function() {
        //Set up globals and mock all stores, views, models, and variables needed
        // console.log('in before each function');
        // jasmine.Ajax.install();
        // console.log('Ajax is installed');
        // console.log('Create app');
        app = Ext.create('Ext.app.Application', {name: 'SeaGrant_Proto',
            // Need for when we test controller code that activates a viewport
            // think of this step as mocking the viewport
            requires: 'Ext.container.Viewport',
        });
        // VIEW MOCKING #####################################################################################
        // Here we mock a homeview, needed for finding the vendnum component       
        homeView = Ext.create(Ext.define('SeaGrant_Proto.view.Home',{
            extend: 'Ext.Panel',
            xtype: 'Home',
            alias: 'widget.home',
            config: {
                items: [
                    {
                        xtype: 'panel',
                        itemId: 'vendnum',
                        tpl: '</pre><div class="vendnum">{th}{numItems}{v}{i}{loc}{w}{prod}{end}</div><pre>'
                    }
                ]
            }
        }));
        // STORE MOCKING ####################################################################################
        // We need a store that can be refrenced in the onChooseLocation function
        jasmine.Ajax.install();
        store = Ext.create('SeaGrant_Proto.store.Vendor',{
            extend: 'Ext.data.store',
            // this is important, if we don't set this id, the store will be instaniated as SeaGrant_Proto-store-Vendor-1
            storeId: 'Vendor'
        });
        store.load();
        var mockedRequest = jasmine.Ajax.requests.mostRecent();
        mockedRequest.response({
            status: 200,
            responseText:[
                {
                    city: 'NewTest',
                    updated: true,
                    description: 'a place with stuff',
                    zip: '97523',
                    created: true,
                    ext: false,
                    location_description: 'its a place with a thing',
                    lng: -122,
                    lat: 45,
                    email: 'user@email.com',
                    website: 'site.com',
                    phone: '555-555-5555',
                    state: 'OR',
                    street: 'corner street',
                    products: ['fish', 'shellfish', 'more fish', 'coolProduct'],
                    contact_name: 'John Doe',
                    story: 'see other side',
                    name: 'fish place'
                },
                {
                    city: 'OldTest',
                    updated: true,
                    description: 'Old place with junk',
                    zip: '97523',
                    created: true,
                    ext: false,
                    location_description: 'some old items',
                    lng: -124,
                    lat: 44,
                    email: 'user@email.com',
                    website: 'site.com',
                    phone: '555-555-5555',
                    state: 'OR',
                    street: 'corner street',
                    products: ['old fish', 'clams', 'more fish', 'TestProduct'],
                    contact_name: 'Old Dan',
                    story: 'see other side',
                    name: 'old market'
                },
                 {
                    city: 'NewTest',
                    updated: true,
                    description: 'all the new stuff',
                    zip: '97523',
                    created: true,
                    ext: false,
                    location_description: 'has one thing',
                    lng: -122,
                    lat: 45,
                    email: 'user@email.com',
                    website: 'site.com',
                    phone: '555-555-5555',
                    state: 'OR',
                    street: 'corner street',
                    products: ['cod', 'shells', 'crab', 'TestProduct'],
                    contact_name: 'Cap \'n Crunch',
                    story: 'see other side',
                    name: 'The ship'
                },
                {
                    city: 'OldTest',
                    updated: true,
                    description: 'Base of everything',
                    zip: '97523',
                    created: true,
                    ext: false,
                    location_description: 'Basic items',
                    lng: -124,
                    lat: 44,
                    email: 'user@email.com',
                    website: 'site.com',
                    phone: '555-555-5555',
                    state: 'OR',
                    street: 'corner street',
                    products: ['basic fish', 'clams', 'less fish', 'TestProduct'],
                    contact_name: 'Basic Bob',
                    story: 'see other side',
                    name: 'basic market'
                }
            ]
        });
        // VARIABLE MOCKING #################################################################################
        thing;
        // Here we mock a record to be passed into onChooseLocation function
        rec = {
            _baseCls: "x-field",
            _cls: [
                {
                    0: "x-toggle-field"
                },
                {
                    1: "x-form-label-nowrap"
                },
                {
                    length: 2
                }
            ],
            _component: {
                _value:{
                        0: 1
                    },
                        length: 1
            },
            _value: {
                data: {
                    val: 75,
                    title: 'NewTest',
                    name: 'TestProduct',
                    all: {
                        0: 'all 1',
                        1: 'all 2',
                        length: 2
                    }
                }
            }
        };
        // console.log('app created');
        // console.log(app);
        // this checks that the controller is sourced correctly, see the top of List.js (WILL NEED TO REMOVE THIS)
        if(isPresent === true){
            console.log('present is true');
        }
        controller = Ext.create('SeaGrant_Proto.controller.List', {application: app});
        // console.log('controller created');
        // console.log(controller);
        controller.init();
        controller.launch();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
        store = null;
        app.destroy();

        // console.log('app destroyed');
    });

    it('onSetUseLocation, fails due to geolocation', function(){
        // console.log(rec);
        // console.log(rec._component._value[0]);
        // works untill it hits the undefined geolocation, funny thing is that requiring geolocation in the controller makes it
        // so that we have a synchronus loading issue in jasmine ( GO FIGURE! )
        controller.onSetUseLocation(thing, rec);
        expect(position.coords).toNotEqual(NULL);
    });

    it('onSetDistance', function(){
        controller.onSetDistance(thing, rec);
        expect(SeaGrant_Proto.dist).toEqual(75);
    });

    it('onChooseLocation', function(){
        controller.onChooseLocation(thing, rec);
        expect(SeaGrant_Proto.location).toEqual('NewTest');
        // FILTER TEST
        // there are 4 vendors in the store with different locations, so after location filtering, we should
        expect(store.data.length).toEqual(2);
        // then if we filter by product, we should get 1, since only one of the 2 locations has the product TestProduct
        // expect(store.data.length).toEqual(1);
        // CHECK THAT LITEM'S ARE CORRECTLY SET
        expect(SeaGrant_Proto.VstoreLength).toEqual(2);
        console.log('looking for data in all the wrong places');
        console.log(SeaGrant_Proto.Litem[0]);
        expect(SeaGrant_Proto.Litem[0].city).toEqual('NewTest');
        expect(SeaGrant_Proto.Litem[0].lng).toEqual(-122);
        expect(SeaGrant_Proto.Litem[0].lat).toEqual(45);
        expect(SeaGrant_Proto.Litem[0].name).toEqual('fish place');
        expect(SeaGrant_Proto.Litem[1].city).toEqual('NewTest');
        expect(SeaGrant_Proto.Litem[1].lng).toEqual(-122);
        expect(SeaGrant_Proto.Litem[1].lat).toEqual(45);
        expect(SeaGrant_Proto.Litem[1].name).toEqual('The ship');
        // CHECK VENDCOUNT
        expect(vendcount).toEqual(2);
    });

    it('onChooseProduct', function(){
        controller.onChooseProduct(thing, rec);
        expect(SeaGrant_Proto.product).toEqual('TestProduct');
        // FILTER TEST
        // CHECK THAT LITEM'S ARE CORRECTLY SET
        // CHECK VENDCOUNT
    });

    //Note I commented out a lot of the controller so that we could test
    // continue commenting and uncommenting controller sections to get test to work
    // it('#onViewgoCommand', function() {
    //     console.log('#onViewgoCommand function');

    //     controller.onHome();
    //     controller.onChooseLocation();
    //     var go = controller.onViewGoCommand();
    //     // expect(SeaGrant_Proto.cent[0]).toBeTruthy();
    // });
});
