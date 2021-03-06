Ext.define('SeaGrant_Proto.view.Map', {
    extend: 'Ext.Container',
    requires: ['Ext.Map'],
    xtype: 'SeaGrantMap',

   config: {
        layout: 'fit',
        items: [
            {
                xtype: 'map',
                // What MF added
                // This Doesn't work: setCenter: new google.maps.LatLng(44.566988, -123.277046)
                // Now, adding Map options centers the map if the view with the map is loaded before any other view
                 mapOptions: {
                    center: new google.maps.LatLng(43, -123),
                    // mapTypeId: google.maps.MapTypeId.ROADMAP,    this will keep the app from loading correctly
                    zoom: 13
                }                
            }
        ]
    },
    initialize: function(){
        // Need this code, for more info on the process that works for our map so far, go to:
        // http://www.joshmorony.com/integrating-the-google-maps-api-into-a-sencha-touch-application/
        var me = this;
        me.callParent(arguments);
        this.initMap();

        // TRYING TO MAKE MAP LOAD IN HERE
        // Wasn't very successful
        // var mapOptions = {
        //     center: new google.maps.LatLng(44.634115, -124.062796),
        //     mapTypeId: google.maps.MapTypeId.ROADMAP,
        //     zoom: 18,
        //     offsetWidth: 1
        // };
        // var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // **all of this code was never used**
        // The fix that Sencha says is implemented (FYI: its not!)
        // Also this fix doesn't work, because the map is not reinitialized when we go from home to list screen.
        // var map = Ext.getCmp('SeaGrantMap').map;
        // this.on({
        //     show: function(){
        //         google.maps.event.trigger(map, 'resize');
        //         map.panTo(new google.maps.LatLng(44.634115, -124.062796));
        //         google.maps.event.trigger(map, 'zoom_changed');
        //     }
        // }); 
        // HELPER CODE 
        // SEE: http://www.sencha.com/forum/showthread.php?151775-Ext.Map-rendered-incorrect-in-initially-hidden-Ext.tab.Panel
        // google.maps.event.trigger(this.googleMap, 'resize');
        // google.maps.event.trigger(this.googleMap, 'zoom_changed');
        // this.googleMap.setCenter(coords);        
    }, 
    initMap: function(){
 
        var mapPanel = this.down('map');
        SeaGrant_Proto.gMap = mapPanel.getMap();

        // console.log('in the initmap function:');
        // console.log(SeaGrant_Proto);

        // this should reset our map center, but it doesn't
        //  setTimeout(function() {
        //    SeaGrant_Proto.gMap.panTo(new google.maps.LatLng(44.634115, -124.062796));
        // }, 100);

        // I first of all thought that 
        // "this function correctly reset our center on the first 
        // go button press (but only if you loaded the map and mash the go button real fast), 
        // because the map in the listview is not instantiated before the go button press, 
        // so there is no gMap declared yet."
        // The truth is that I did not set the timeout time for a long enough period. Now calling this function on a go button 
        // press is enough to recenter the mapp to the correct location.
        // var cent = new google.maps.LatLng(44.634115, -124.062796);
        // setTimeout(function() {
        //    SeaGrant_Proto.gMap.panTo(cent);
        //    // SeaGrant_Proto.gMap.zoom(14);
        // }, 100);
         
         // This sets a static hard coded marker
        // var marker = new google.maps.Marker({
        //     map: SeaGrant_Proto.gMap,
        //     animation: google.maps.Animation.DROP,
        //     position: new google.maps.LatLng(44.634115, -124.062796)
        // });
    }
});