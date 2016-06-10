$(function () {
    var last = null;
    var total_frames = 0;
    var slow_frames = 0;
    var start_time = 0;
    var worst = 0;
    var frame_index = 0;
    var frames = [];
    var N = 60;
    var start = new Date();

    window.loaded = function (_start) {
        if (_start) {
            start = _start;
        }
        var end = new Date();
        $('#stat-load').text(
            (end - start) + 'ms'
        ).parent().css('display', '');
    };

    frames.length = N;
    var i;

    var $el = $('<div/>').appendTo('body')
            .css({
                position: 'absolute',
                right: '10px',
                top: '10px',
                width: '300px',
                background: 'white',
                border: '1px solid black',
                'z-index': '1001'
            });

    var stat_html = [
        '<table style="width:100%">',
        '<tr>',
        '<td>current fps</td><td id=stat-fps></td>',
        '</tr><tr>',
        '<td>average fps</td><td id=stat-average></td>',
        '</tr><tr>',
        '<td>dropped frames</td><td id=stat-slow></td>',
        '</tr><tr>',
        '<td>worst frame</td><td id=stat-worst></td>',
        '</tr><tr style="display:none">',
        '<td>load time</td><td id=stat-load></td>',
        '</tr>',
        '</table>',
        '<button style="float:right;margin:5px" onclick="reset_stats()">Reset</button>'
    ].join('');
    $el.append(stat_html);
    var els = {
        fps: $el.find('#stat-fps'),
        average: $el.find('#stat-average'),
        slow: $el.find('#stat-slow'),
        worst: $el.find('#stat-worst')
    };


    var get_fps = function () {
        var i, sum = 0;
        for (i = 0; i < N; i += 1) {
            sum += frames[i];
        }
        return (1000 * N) / sum;
    }

    var frame = function (time) {
        if (last) {
            frame_time = time - last;

            frames[frame_index] = frame_time;
            frame_index = (frame_index + 1) % N;
            total_frames += 1;

            if (frame_time > 20) {
                slow_frames += 1;
            }

            if (frame_time > worst) {
                worst = frame_time;
            }

            window.stats = {
                fps: get_fps(),
                frames: total_frames,
                slow: slow_frames,
                percent: slow_frames / total_frames,
                average: 1000 * total_frames / (time - start_time),
                last: frame_time,
                worst: worst
            };
            els.fps.text(window.stats.fps.toFixed(2));
            els.average.text(window.stats.average.toFixed(2));
            els.slow.text((100 * window.stats.percent).toFixed(2) + '%');
            els.worst.text(window.stats.worst.toFixed(2) + 'ms')
        } else {
            start_time = time;
        }
        last = time;
        requestAnimationFrame(frame);
    };

    window.reset_stats = function () {
        total_frames = 0;
        slow_frames = 0;
        start_time = 0;
        worst = 0;
        last = null;
        frame_index = 0;
        frames = [];
        frames.length = N;
        for (i = 0 ; i < N; i += 1) {
            frames[i] = 16;
        }
    };

    window.setTimeout(function () {
        $('.bk-tool-icon-wheel-zoom').click();
    }, 500);
    window.reset_stats();
    requestAnimationFrame(frame);

    function get_size() {
        variable = 'size';
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return parseFloat(decodeURIComponent(pair[1]));
            }
        }
    }

    window.get_data = function () {
        var n = get_size();
        function filter(_, i) {
            return !n || i < n;
        }
        return $.ajax('random.json').then(function (data) {
            return {
                x: data.x.filter(filter),
                y: data.y.filter(filter),
                id: data.id.filter(filter)
            };
        });
    };

    window.get_geojson = function () {
        return window.get_data().then(function (data) {
            return {
                type: 'FeatureCollection',
                features: data.id.map(function (_, i) {
                    var x = (data.x[i] % 340) - 170;
                    var y = (data.y[i] % 160) - 80;
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [x, y]
                        },
                        properties: {
                            id: data.id[i]
                        }
                    };
                })
            };
        });
    };
});
