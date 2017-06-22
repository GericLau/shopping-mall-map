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
        infowindow.setContent('Mall information loading');
        // foursquare API get venue info
        var latestversion = this.getLatestVersion(),
            oauth_token = "5BEUWLP13HU3XWQD5VSFPOINAMGK2R5FQS4HMX0OXWHE5H0U",
            //oauth_token = "hahh",
            url = "https://api.foursquare.com/v2/venues/"+marker.venueId+"?oauth_token="+oauth_token+"&v="+latestversion,
            that = this,
            foursquareObj = {};

        $.ajax( {
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                var venue = data.response.venue;
                var venueAlbums = venue.photos.groups;
                var firstImage = that.getPhotos(venueAlbums);

                foursquareObj = {
                    id: venue.id,
                    name: venue.name,
                    streetAddress: venue.location.address,
                    rating: venue.rating,
                    locality: venue.location.city,
                    image: firstImage
                };

                infowindow.setContent('<div id="info">' +
                                        '<h2 class="mall-name">' + foursquareObj.name + '</h2>' +
                                        '<img class="mall-image" src="' + foursquareObj.image + '" alt="' + foursquareObj.name + '" >' +
                                        '<p class="mall-addr">' + foursquareObj.streetAddress + '</p>' +
                                        '<span class="rating">' + foursquareObj.rating + '</span>' +
                                        '</div>');

            },
            error: function(e) {
                infowindow.setContent('Could not load foursquare info');
            }
        });

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
            venueId = mallItem.venueId,
            defaultIcon = makeMarkerIcon('FE7569'),
            marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: index,
                venueId: venueId
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

/*    this.bounce = function(mall) {
        google.maps.event.trigger(self.marker, 'click');
    };*/
}

var getPhotos = function(venueAlbums){
    var heightDimension = 150,
        widthDimension = 150,
        album = "";

    var dimensions = heightDimension+'x'+widthDimension;
    // test for get the first image
    var firstImage = venueAlbums[0].items[0];

    album = firstImage.prefix+dimensions+firstImage.suffix;
    return album;
}

var getLatestVersion = function(){
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth(),
        day = d.getMonth();

    if(month <10){
        month = "0"+month;
    }

    if(day <10){
        day = "0"+day;
    }

    return year+month+day;
}

ko.applyBindings(new ViewModel());