$(function () {

    var selected = null;
    var node = d3.select('body').append('div')
        .style('width', '1000px')
        .style('height', '1000px')
        .node();
    var map = geo.map({
        node: node,
        gcs: '+proj=longlat +axis=esu',
        ingcs: '+proj=longlat +axis=enu',
        maxBounds: {left: 0, top: 0, right: 1000, bottom: 1000},
        center: {x: 500, y: 500},
        zoom: 0
    });
    var layer = map.createLayer('feature');
    var feature = layer.createFeature('point', {selectionAPI: true})
        .style({
            fill: true,
            fillColor: 'steelblue',
            radius: 10,
            fillOpacity: 0.9,
            stroke: false
        })
        .geoOn(geo.event.feature.mouseon, function (evt) {
            tooltip.position({x: evt.data.x, y: evt.data.y});
            $el.text('element id: ' + evt.data.id);
            $el.removeClass('hidden');
            selected = evt.data.id;
            hover.data([evt.data]);
            map.draw();
        })
        .geoOn(geo.event.feature.mouseoff, function (evt) {
            $el.addClass('hidden');
            selected = null;
            hover.data([]);
            map.draw();
        });

    var hover = layer.createFeature('point')
        .style({
            fill: true,
            fillColor: 'red',
            radius: 10,
            fillOpacity: 1,
            stroke: false
        });
    var ui = map.createLayer('ui');
    var tooltip = ui.createWidget('dom', {position: {x: 0, y: 0}});
    var $el = $(tooltip.canvas()).attr('id', 'tooltip').addClass('hidden')

    d3.json('./random.json', function (err, _data) {
        var start = new Date();
        var data = _data.id.filter(function (_, i) {
            return true; //i < 10000;
        }).map(function (_, i) {
            return {
                x: _data.x[i],
                y: _data.y[i],
                id: _data.id[i]
            };
        });

        feature.data(data);
        map.draw();
        window.loaded(start);
    });
});
