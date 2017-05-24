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
]
var Mall = function(data) {
    this.title = ko.observable(data.title);
}

var ViewModel = function() {
    var that = this;
    this.mallList = ko.observableArray([]);

    initialMall.forEach(function(mallItem){
        that.mallList.push( new Mall(mallItem) )
    });
}

ko.applyBindings(new ViewModel());