var malls = [
    {
        title: 'KK One',
        location : {
            lat : 22.5312533,
            lng : 114.0612242
        },
        venueId : '574d68eb498efef6821475a3'
    },
    {
        title : 'Coastal City',
        location : {
            lat : 22.518318,
            lng : 113.937145
        },
        venueId : '4b8fb877f964a520bb5e33e3'
    },
    {
        title: 'Galaxy Cocopark',
        location : {
            lat : 22.533611,
            lng : 114.054821
        },
        venueId : '4e1198e8fa769d21e9ee3f9c'
    },
    {
        title: 'The Mixc',
        location : {
            lat : 22.5373609,
            lng : 114.11116
        },
        venueId : '4ccbb617063a721ecabd899a'
    },
    {
        title: 'The Oct Harbour',
        location : {
            lat : 22.5258226,
            lng : 113.9888996
        },
        venueId : '4eb215696da1df5f01a9799a'
    },
    {
        title: 'KK Mall',
        location : {
            lat : 22.5410434,
            lng : 114.1063674
        },
        venueId : '4cef5decf368b1f75e3685f7'
    }
];

var map,
    markers = [];


function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}

function toggleBounce(marker) {
    // Style the markers a bit.
    var defaultIcon = makeMarkerIcon('FE7569');
    var highlightedIcon = makeMarkerIcon('FFFF24');

    for (var i = 0; i < markers.length; i++){
        if (markers[i].title !== marker.title) {
            markers[i].setIcon(defaultIcon);
        } else {
            markers[i].setIcon(highlightedIcon);
        }
    }
}

function initMap() {
    var kkone = malls[0].location,
        bounds = new google.maps.LatLngBounds(),
        largeInfowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
        center: kkone,
        zoom: 12
    });

    malls.forEach(function(mallItem, index) {
        var title = mallItem.title,
            position = mallItem.location,
            defaultIcon = makeMarkerIcon('FE7569'),
            marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: index
            });

        markers.push(marker);
        markers[index].setMap(map);
        markers[index].setIcon(defaultIcon);
        markers[index].addListener('click', function() {
            toggleBounce(this);
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[index].position);
    });
}

var Mall = function(data) {
    this.title = ko.observable(data.title);
}

var ViewModel = function() {
    var that = this;
    this.mallList = ko.observableArray([]),
    this.filter = ko.observable(""),
    this.resultMall = ko.observableArray([]);

    malls.forEach(function(mallItem){
        that.mallList.push( new Mall(mallItem) )
    });

    this.filteredMalls = ko.computed(function() {
        var filterText = this.filter().toLowerCase();
        // reset the filter result for every query
        that.resultMall = ko.observableArray([]);

        if (!filterText) {
            // setMap for all markers when input is null
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
            return that.mallList();
        } else {
            // clear the markers
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            // push the mall into result match query
            malls.forEach(function(mallItem, i){
                if(mallItem.title.toLowerCase().indexOf(that.filter().toLowerCase()) >= 0) {
                    that.resultMall.push( new Mall(mallItem) );
                    // setMap for the matched item
                    markers[i].setMap(map);
                }
            });
            return that.resultMall();
        }
    },this);
}

ko.applyBindings(new ViewModel());