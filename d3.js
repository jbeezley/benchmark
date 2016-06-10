$(function () {

    var lastscale = 1;
    function zoomed() {
        lastscale = d3.event.scale;
        svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    }

    function zoomend() {
        if (!selection) {
            return;
        }
        selection
            .attr('r', 10 / lastscale);
    }

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 20])
        .size([1000, 1000])
        .on('zoom', zoomed)
        .on('zoomend', zoomend);

    var svg = d3.select('body')
        .append('svg')
        .attr('width', '1000')
        .attr('height', '1000')
        .call(zoom)
        .append('g');

    var selection;

    d3.json('./random.json', function (err, _data) {
        var data = _data.id.filter(function (_, i) {
            return true;
        }).map(function (_, i) {
            return {
                x: _data.x[i],
                y: _data.y[i],
                id: _data.id[i]
            };
        });

        var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
            return 'element id: ' + d.id;
        });
        svg.call(tip);
        selection = svg.selectAll('circle').data(data);

        selection.enter()
            .append('circle')
            .attr('cx', function (d) {return d.x;})
            .attr('cy', function (d) {return d.y;})
            .attr('r', '10')
            .style('fill', 'steelblue')
            .style('fill-opacity', 0.9)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    });
});
