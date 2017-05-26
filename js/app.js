var initialMall = [
    {
        title: 'Coastal City',
        location:
        {
            lat: 40.7713024,
            lng: -73.9632393
        }
    },
    {
        title: 'Coco Park',
        location:
        {
            lat: 40.7713024,
            lng: -73.9632393
        }
    },
    {
        title: 'The Mixc',
        location:
        {
            lat: 40.7713024,
            lng: -73.9632393
        }
    },
    {
        title: 'The Oct Harbour',
        location:
        {
            lat: 40.7713024,
            lng: -73.9632393
        }
    },
    {
        title: 'KK Mall',
        location:
        {
            lat: 40.7713024,
            lng: -73.9632393
        }
    },
    {
        title: 'KK One',
        location:
        {
            lat: 40.7713024,
            lng: -73.9632393
        }
    }
];

var map;
function initMap() {
    var Cincinnati = {lat: 37.285984, lng: -91.3583594};
    map = new google.maps.Map(document.getElementById('map'), {
        center: Cincinnati,
        zoom: 13
    });

    var marker = new google.maps.Marker({
        position: Cincinnati,
        map: map
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