var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title       : 'Awesome Test Suite',

    preload     : [
        '../touch/resources/css/sencha-touch.css',
        '../resources/css/app.css',

        
        '../touch/sencha-touch-all-debug.js',
        'http://maps.google.com/maps/api/js?sensor=true',
        // Views
        '../app/view/Location.js',
        '../app/view/Map.js',
        '../app/view/ListView.js',
        '../app/view/Info.js',
        '../app/view/Specific.js',
        '../app/view/Home.js',
        '../app/view/Detail.js',
        '../app/view/TestView.js',
        // Controller
        '../app/controller/List.js',
        // Stores
        '../app/store/Info.js',
        '../app/store/Location.js',
        '../app/store/Product.js',
        '../app/store/Vendor.js',
        '../app/store/CountryStore.js',
        '../app/store/Education.js',
        '../app/store/Distance.js',
        // Models
        '../app/model/City.js',
        '../app/model/Locations.js',
        '../app/model/Products.js',
        '../app/model/Test.js',
        '../app.js'
    ]
});

Harness.start(
    {
        group : 'Sanity checks',
        autoCheckGlobals : false,
        items : [
            'sanity_tests/sane.t.js',
            'sanity_tests/010_sanity.t.js',
            'sanity_tests/HelloWorld.t.js',
            'sanity_tests/simple.t.js'
        ]
    },
    {
        group : 'UI checks',
        autoCheckGlobals : false,
        items : [
            'ui_tests/home_test.t.js',
            'ui_tests/detail_test.t.js',
            'ui_tests/list_test.t.js',
            'ui_tests/info_test.t.js',
            'ui_tests/specific_test.t.js'
        ]
    }
);
