$(function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamJlZXpsZXkiLCJhIjoiaHlXM01kNCJ9.od3nUvvjbGjwOAr6E7o7xQ';

    window.get_geojson().then(function (geojson) {
        var start = new Date();
        var hover = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [0, 0]
                },
                properties: {
                    id: -1
                }
            }]
        };

        var map = new mapboxgl.Map({
            container: 'map',
            style: {
                version: 8,
                name: 'null',
                sources: {
                    'point': {
                        type: 'geojson',
                        data: geojson
                    }
                },
                layers: [{
                    id: 'point',
                    type: 'circle',
                    source: 'point',
                    paint: {
                        'circle-radius': 10,
                        'circle-color': '#4682b4'
                    }
                }]
            },
            center: [0, 0],
            zoom: 0
        });

        map.on('load', function () {
            map.addSource('hover', {
                type: 'geojson',
                data: hover
            });
            map.addLayer({
                id: 'hover',
                type: 'circle',
                source: 'hover',
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#ff0000'
                },
                filter: ['==', 'id', '']
            });
            window.loaded(start);
        });

        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mousemove', function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['point']
            });

            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

            if (!features.length) {
                popup.remove();
                map.setFilter('hover', ['==', 'id', '']);
                return;
            }

            var id = features[0].properties.id;
            var pt = geojson.features[id].geometry.coordinates;
            popup.setLngLat(pt)
                .setHTML('element id: ' + id)
                .addTo(map);
            hover.features[0].geometry.coordinates = pt;
            hover.features[0].properties.id = id;
            map.setFilter('hover', ['==', 'id', id]);
            map.getSource('hover').setData(hover);
        });
    });
});
