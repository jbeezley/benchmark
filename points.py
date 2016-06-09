from bokeh.models import HoverTool, AjaxDataSource
from bokeh.plotting import figure, show, output_file

data = AjaxDataSource(data_url='./random.json', method='GET', content_type='application/json')
output_file("bokeh.html", title="scatter 100k points (with WebGL)")

p = figure(webgl=True, tools=[HoverTool(), 'pan', 'wheel_zoom'], plot_height=1000, plot_width=1000)
p.circle('x', 'y', alpha=0.9, source=data, size=10)

show(p)
