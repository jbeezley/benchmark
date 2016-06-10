$(function () {

    var plt = $('<div/>').appendTo('body')
        .attr('id', 'plot')
        .css('width', '1000px')
        .css('height', '1000px');

    window.get_data().then(function (data) {
        var start = new Date();

        var spec = [{
            x: data.x,
            y: data.y,
            type: 'scattergl',
            name: 'points',
            mode: 'markers',
            marker: {size: 10}
        }];
        var layout = {
            hovermode: 'closest'
        };
        Plotly.plot(plt.get(0), spec, layout);

        window.loaded(start);
    });
});
