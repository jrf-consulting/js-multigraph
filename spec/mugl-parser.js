var xml2js = require("xml2js");
var fs = require("fs");
require("./stringify.js");

var parser = new xml2js.Parser({
    explicitArray: false,
	mergeAttrs: true,
	explicitRoot: false,
	charkey: "text"
});

fs.readdir(__dirname + '/mugl', function (err, files) {
	var i, l;
	for (i = 0, l = files.length; i < l; i++) {
		if (files[i].indexOf(".xml") !== -1) convertMugl(files[i]);
	}
})

function convertMugl(file) {
	fs.readFile(__dirname + '/mugl/' + file, function(err, data) {
		parser.parseString(data, function (err, result) {
			standardizeWindow(result);
			standardizePlotarea(result);
			standardizePlots(result);
			standardizeLegend(result);
			standardizeTitle(result);
			standardizeBackground(result);
			standardizeParentData(result);
			standardizeAxes(result, "verticalaxis", "verticalaxes");
			standardizeAxes(result, "horizontalaxis", "horizontalaxes");
			reorderTags(result);
			fs.writeFile(__dirname + '/json-mugl/' + file.replace(".xml", ".json"), JSON.stringify(result, null, 2), function () {});
		});
	});
}

function reorderTags (mugl) {
	var i, l;

	recreateTags(mugl, ["title", "window", "plotarea", "background",
		"horizontalaxis", "horizontalaxes", "verticalaxis", "verticalaxes",
		"plot", "plots", "legend", "data", "throttle"]);

	if (mugl.title) reorderTitle(mugl.title);
	if (mugl.window) reorderWindow(mugl.window);
	if (mugl.plotarea) reorderPlotarea(mugl.plotarea);
	if (mugl.background) reorderBackground(mugl.background);
	if (mugl.horizontalaxis) reorderAxis(mugl.horizontalaxis);
	if (mugl.horizontalaxes) for (i = 0, l = mugl.horizontalaxes.length; i < l; i++) reorderAxis(mugl.horizontalaxes[i]);
	if (mugl.verticalaxis) reorderAxis(mugl.verticalaxis);
	if (mugl.verticalaxes) for (i = 0, l = mugl.verticalaxes.length; i < l; i++) reorderAxis(mugl.verticalaxes[i]);
	if (mugl.plot) reorderPlot(mugl.plot);
	if (mugl.plots) for (i = 0, l = mugl.plots.length; i < l; i++) reorderPlot(mugl.plots[i]);
	if (mugl.data) {
		if (Array.isArray(mugl.data)) for (i = 0, l = mugl.data.length; i < l; i++) reorderData(mugl.data[i]);
		else reorderData(mugl.data)
	}
	if (mugl.throttle) reorderThrottle(mugl.throttle);
}

function reorderTitle (title) {
	recreateTags(title, ["text", "base", "anchor", "position", "frame", "fontsize",
		"color", "opacity", "border", "bordercolor", "padding", "cornerradius"]);
}

function reorderWindow (wind) {
	recreateTags(wind, ["width", "height", "border", "bordercolor", "padding", "margin"]);
}

function reorderPlotarea (plotarea) {
	recreateTags(plotarea, ["color", "border", "bordercolor",
	 "marginbottom", "margintop", "marginleft", "marginright"]);
}

function reorderBackground (background) {
	recreateTags(background, ["color", "img"]);
	if (background.img) recreateTags(background.img, ["src", "base", "anchor", "position", "frame"]);
}

function reorderAxis (axis) {
	recreateTags(axis, ["id", "type", "length", "base", "anchor", "position",
		"min", "max", "minoffset", "maxoffset", "minposition", "maxposition",
		"color", "linewidth", "tickmin", "tickmax", "tickcolor", "highlightstyle", "positionbase",
		"pregap", "postgap", "title", "labels", "grid", "pan", "zoom", "binding"]);

	if (axis.title) recreateTags(axis.title, ["text", "base", "anchor", "position", "angle"]);
	if (axis.labels) {
		recreateTags(axis.labels, ["format", "spacing", "start", "anchor", "position",
			"angle", "color", "densityfactor", "label"]);
		if (axis.labels.label) {
			var i, l;
			for (i = 0, l = axis.labels.label.length; i < l; i++) recreateTags(axis.labels.label[i], [
				"format", "spacing", "start", "anchor", "position", "angle", "color", "densityfactor"
			])
		}
	}
	if (axis.grid) recreateTags(axis.grid, ["color", "visible"]);
	if (axis.pan) recreateTags(axis.pan, ["allowed", "min", "max"]);
	if (axis.zoom) recreateTags(axis.zoom, ["allowed", "min", "max", "anchor"]);
	if (axis.binding) recreateTags(axis.binding, ["id", "min", "max"]);
}

function reorderPlot (plot) {
	recreateTags(plot, ["style", "options", "horizontalaxis", "verticalaxis", "verticalaxes", "legend", "datatips"]);

	if (plot.datatips) recreateTags(plot.datatips, ["format", "bgcolor", "bgalpha",
		"border", "bordercolor", "pad", "variable-formats"]);
}

function reorderData (data) {
	recreateTags(data, ["id", "adapter", "missingvalue", "missingop", "variables", "repeat", "values", "csv", "service"]);
}

function reorderThrottle (throttle) {
	recreateTags(throttle, ["pattern", "requests", "period", "concurrent"]);
}

function recreateTags (mugl, tags) {
	var i, l;
	for (i = 0, l = tags.length; i < l; i++) recreateTag(mugl, tags[i]);
}

function recreateTag (mugl, tag) {
	if (mugl.hasOwnProperty(tag)) {
		mugl.renameProperty(tag, "new-" + tag);
		mugl.renameProperty("new-" + tag, tag);
	}
}

Object.prototype.renameProperty = function (oldName, newName) {
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (this.hasOwnProperty(oldName)) {
        this[newName] = this[oldName];
        delete this[oldName];
    }
    return this;
};

function standardizeIntegers (data, props) {
	var i, l;
	for (i = 0, l = props.length; i < l; i++) {
		if (data[props[i]]) data[props[i]] = parseInt(data[props[i]], 10);
	}
}

function standardizeDoubles (data, props) {
	var i, l;
	for (i = 0, l = props.length; i < l; i++) {
		if (data[props[i]]) data[props[i]] = parseFloat(data[props[i]]);
	}
}

function standardizePositions (data, props) {
	var i, j, l, ll, prop;
	for (i = 0, l = props.length; i < l; i++) {
		prop = data[props[i]];
		if (!prop) continue;
		prop = prop.trim();
		if (prop.indexOf(",") !== -1) prop = prop.split(",");
		else if (prop.indexOf(" ") !== -1) prop = prop.split(/\s+/);
		else prop = parseFloat(prop);
		
		if (Array.isArray(prop)) {
			for (j = 0, ll = prop.length; j < ll; j++) {
				prop[j] = parseFloat(prop[j]);
			}
		}

		data[props[i]] = prop;
	}
}

function parseBoolean (prop) {
	switch (prop.toLowerCase()) {
		case "yes":
		case "true":
			return true;
		case "no":
		case "false":
			return false;
	}
}

function standardizeWindow (data) {
    if (!data.window) return;
	standardizeIntegers(data.window, ["width", "height", "border", "margin", "padding"]);
}

function standardizePlotarea (data) {
    if (!data.plotarea) return;
	standardizeIntegers(data.plotarea, ["marginbottom", "marginleft", "margintop", "marginright", "border"]);
}

function standardizeTitle (data) {
    if (!data.title) return;

	var title = data.title;
	standardizePositions(title, ["anchor", "base", "position"]);
	standardizeIntegers(title, ["border", "padding", "cornerradius", "fontsize"]);
	standardizeDoubles(title, ["opacity"]);
}

function standardizeBackground (data) {
    if (!data.background) return;
	if (!data.background.img) return;
	standardizePositions(data.background.img, ["anchor", "base", "position"]);
}

function standardizeLegend (data) {
    if (!data.legend) return;

	var legend = data.legend;
	standardizeIntegers(legend, ["border", "rows", "columns", "cornerradius", "padding"]);
	standardizeDoubles(legend, ["opacity"]);
	standardizePositions(legend, ["anchor", "base", "position"]);
	if (legend.icon) standardizeIntegers(legend.icon, ["border", "height", "width"]);
}

function standardizePlots (data) {
    if (data.plot) {
		if (Array.isArray(data.plot)) {
			data.renameProperty("plot", "plots");
			var plots = data.plots;
			var i, l;
			for (i = 0, l = plots.length; i < l; i++) {
				standardizePlot(plots[i]);
			}
		} else {
			standardizePlot(data.plot);
		}
	}
}

function standardizePlot (plot) {
	if (plot.datatips) standardizeDatatips(plot.datatips);
	if (plot.renderer) standardizeRenderer(plot.renderer, plot);
	if (plot.legend) standardizePlotLegend(plot);
	if (plot.verticalaxis) standardizePlotAxis(plot, "verticalaxis");
	if (plot.horizontalaxis) standardizePlotAxis(plot, "horizontalaxis");
}

function standardizePlotAxis (plot, type) {
	var axis = plot[type];
	var axisRef = axis.ref;

	if (axis.constant) {
		if (axisRef) {
			plot[type] = {};
			plot[type][axisRef] = axis.constant.value;
		} else {
			plot[type] = axis.constant.value;
		}
		return;
	}

	if (axis.variable) {
		var variable = axis.variable;

		if (Array.isArray(variable)) {
			var variables = [];
			var i, l;
			for (i = 0, l = variable.length; i < l; i++) variables.push(variable[i].ref);
		} else {
			var variables = variable.ref;
		}

		if (axisRef) {
			plot[type] = {};
			plot[type][axisRef] = variables;
		} else {
			plot[type] = variables;
		}
		return;
	}

	plot[type] = axisRef;
}

function standardizeRenderer (renderer, plot) {
	if (renderer.option) {
		var options = renderer.option;
		var newOptions = {};
		if (Array.isArray(options)) {
			var i, l;
			for (i = 0, l = options.length; i < l; i++) {
				standardizeOption(options[i], newOptions);
			}
		} else {
			standardizeOption(options, newOptions);
		}
		plot.options = newOptions;
	}
	
	if (renderer.type) plot.style = renderer.type;
	
	delete plot.renderer;
}

function standardizeOption (option, newOptions) {
	if (option.hasOwnProperty("min") || option.hasOwnProperty("max")) {
		var prop = {};
		prop["value"] = option.value;
		if (option.hasOwnProperty("min")) {
			prop["min"] = option.min;
		}
		if (option.hasOwnProperty("max")) {
			prop["max"] = option.max;
		}
	} else {
		var prop = option.value;
	}

	if (newOptions.hasOwnProperty(option.name)) {
		var existingOption = newOptions[option.name];
		var optionsToInsert = (Array.isArray(existingOption)) ? existingOption : [existingOption];
		var propToInsert = (typeof prop === "object") ? prop : {"value" : prop};
		optionsToInsert.push(propToInsert);
		newOptions[option.name] = optionsToInsert;
	} else {
		newOptions[option.name] = prop;
	}
}

function standardizePlotLegend (plot) {
	var legend = plot.legend;

	if (legend.hasOwnProperty("visible")) {
		var visibility = parseBoolean(legend.visible);
		if (legend.hasOwnProperty("label")) legend.visible = visibility;
		else plot.legend = visibility; 
	}
}

function standardizeDatatips(datatips) {
	standardizeIntegers(datatips, ["border", "pad"]);
	standardizeDoubles(datatips, ["bgalpha"]);
	if (datatips.hasOwnProperty("variable")) {
		var variables = datatips.variable;
		var newFormats = [];
		var i, l;
		if (Array.isArray(variables)) {
			for (i = 0, l = variables.length; i < l; i++) {
				newFormats.push(variables[i].format);
			}
		} else {
			newFormats.push(variables.format);
		}
		datatips.variable = newFormats;
		datatips.renameProperty("variable", "variable-formats");
	}
}

function standardizeParentData (graph) {
    if (graph.data) {
		var data = graph.data;
		if (Array.isArray(data)) {
			var i, l;
			for (i = 0, l = data.length; i < l; i++) {
				standardizeData(data[i]);
			}
		} else {
			standardizeData(data);
		}
	}
}

function standardizeData (data) {
	var i, l;
	if (data.variables) {
		var variables = data.variables;

		if (variables.missingvalue) data.missingvalue = variables.missingvalue;
		if (variables.missingop) data.missingop = variables.missingop;

		if (variables.variable) {
			var oldVariables = variables.variable;
			var newVariables = (Array.isArray(oldVariables)) ? oldVariables : [oldVariables];
			for (i = 0, l = newVariables.length; i < l; i++) standardizeIntegers(newVariables[i], ["column"]);
			data.variables = newVariables;
		} else {
			delete data.variables;
		}
	}

	if (data.values) {
		var values = data.values.trim(),
		    value;
		values = values.split("\r\n");
		for (i = 0, l = values.length; i < l; i++) {
			value = values[i].trim().replace(/\s+/g, " ");
			values[i] = (value.indexOf(",") !== -1) ? value.split(",") : value.split(" ");
		}
		data.values = values;
	}
}

function standardizeAxes (graph, type, newType) {
	var axes;
	var i, l;

	if (graph.hasOwnProperty(type)) {
		if (Array.isArray(graph[type])) {
			graph.renameProperty(type, newType);
			for (i = 0, l = graph[newType].length; i < l; i++) {
				standardizeAxis(graph[newType][i]);
			}
		} else {
			standardizeAxis(graph[type]);
		}
	}
}

function standardizeAxis (axis) {
	standardizeIntegers(axis, ["linewidth", "tickwidth", "tickmin", "tickmax"]);
	standardizeDoubles(axis, ["anchor", "pregap", "postgap", "minoffset", "maxoffset"]);
	standardizePositions(axis, ["base", "position"]);

	if (axis.type !== "datetime") {
		if (axis.hasOwnProperty("min") && axis.min !== "auto") axis.min = parseFloat(axis.min);
		if (axis.hasOwnProperty("max") && axis.max !== "auto") axis.max = parseFloat(axis.max);
	}

	standardizeAxisTitle(axis);
	standardizePan(axis);
	standardizeZoom(axis);
	standardizeGrid(axis);
	standardizeBinding(axis);

	if (axis.hasOwnProperty("labels")) standardizeLabeler(axis, axis.labels);
}

function standardizeLabeler (axis, label) {
	var i, l;
	standardizeDoubles(label, ["angle", "densityfactor"]);
	standardizePositions(label, ["anchor", "position"]);
	if (label.hasOwnProperty("visible")) label.visible = parseBoolean(label.visible);
	if (label.hasOwnProperty("spacing")) label.spacing = label.spacing.trim().replace(/\s+/g, " ").split(" ");

	if (axis.type !== "datetime") {
		standardizeDoubles(label, ["start"]);
		if (label.hasOwnProperty("spacing")) {
			for (i = 0, l = label.spacing.length; i < l; i++) label.spacing[i] = parseFloat(label.spacing[i]);
		}
	}

	if (label.hasOwnProperty("label")) {
		var labels = label.label;
		if (Array.isArray(labels)) {
			for (i = 0, l = labels.length; i < l; i++) standardizeLabeler(axis, labels[i]);
		} else {
			standardizeLabeler(axis, labels);
			label.label = [labels];
		}
	}
}

function standardizeAxisTitle (axis) {
	if (!axis.title) return;
	var title = axis.title;
	if (!title.text) {
		axis.title = false;
		return;
	}
	standardizeDoubles(title, ["base", "angle"]);
	standardizePositions(title, ["anchor", "position"]);
}

function standardizeGrid (axis) {
	if (!axis.hasOwnProperty("grid")) return;
	var grid = axis.grid;
	if (typeof grid === "string") axis.grid = {};
	if (grid.hasOwnProperty("visible")) grid.visible = parseBoolean(grid.visible);
}

function standardizePan (axis) {
	if (!axis.hasOwnProperty("pan")) return;
	var pan = axis.pan;
	if (pan.hasOwnProperty("allowed")) {
		var allowed = parseBoolean(pan.allowed);
		if (!pan.hasOwnProperty("min") && !pan.hasOwnProperty("max")) axis.pan = allowed;
		else pan.allowed = allowed;
	}

	if (axis.type !== "datetime") {
		standardizeDoubles(pan, ["min", "max"]);
	}
}

function standardizeZoom (axis) {
	if (!axis.hasOwnProperty("zoom")) return;
	var zoom = axis.zoom;
	if (zoom.hasOwnProperty("allowed")) {
		var allowed = parseBoolean(zoom.allowed);
		if (!zoom.hasOwnProperty("min") && !zoom.hasOwnProperty("max") && !zoom.hasOwnProperty("anchor")) axis.zoom = allowed;
		else zoom.allowed = allowed;
	}

	if (axis.type !== "datetime") {
		standardizeDoubles(zoom, ["min", "max"]);
		if (zoom.hasOwnProperty("anchor") && zoom.anchor !== "none") zoom.anchor = parseFloat(zoom.anchor);
	}
}

function standardizeBinding (axis) {
	if (!axis.hasOwnProperty("binding")) return;
	if (axis.type !== "datetime") standardizeDoubles(axis.binding, ["min", "max"]);
}
