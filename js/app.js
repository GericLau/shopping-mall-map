var initialMall = [
    {
        title: 'KK One',
        location : {
            lat : 22.5312533,
            lng : 114.0612242
        }
    },
    {
        title : 'Coastal City',
        location : {
            lat : 22.518318,
            lng : 113.937145
        }
    },
    {
        title: 'Galaxy Cocopark',
        location : {
            lat : 22.533611,
            lng : 114.054821
        }
    },
    {
        title: 'The Mixc',
        location : {
            lat : 22.5373609,
            lng : 114.11116
        }
    },
    {
        title: 'The Oct Harbour',
        location : {
            lat : 22.5258226,
            lng : 113.9888996
        }
    },
    {
        title: 'KK Mall',
        location : {
            lat : 22.5410434,
            lng : 114.1063674
        }
    }
];

var map,
    markers = [];

function initMap() {
    var kkone = initialMall[0].location,
        bounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(document.getElementById('map'), {
        center: kkone,
        zoom: 12
    });

    initialMall.forEach(function(mallItem, index) {
        var title = mallItem.title,
            position = mallItem.location,
            marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: index
            });

        markers.push(marker);
        markers[index].setMap(map);
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

    initialMall.forEach(function(mallItem){
        that.mallList.push( new Mall(mallItem) )
    });

    this.filteredMalls = ko.computed(function() {
        var filterText = this.filter().toLowerCase();
        // reset the filter result for every query
        that.resultMall = ko.observableArray([]);

        if (!filterText) {
            return that.mallList();
        } else {
            // push the mall into result match query
            initialMall.forEach(function(mallItem){
                if(mallItem.title.toLowerCase().indexOf(that.filter().toLowerCase()) >= 0) {
                    that.resultMall.push( new Mall(mallItem) )
                }
            });
            return that.resultMall();
        }
    },this);
}

ko.applyBindings(new ViewModel());