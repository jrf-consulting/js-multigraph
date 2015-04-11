var xml2js = require("xml2js");
var fs = require("fs");

var parser = new xml2js.Parser({
    explicitArray: false,
	mergeAttrs: true,
	explicitRoot: false
});
fs.readFile(__dirname + '/mugl/yearly-yadkin.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
		result.renameProperty("plot", "plots");
		standardizeLegend(result);
		fs.writeFile('yearly-yadkin2.json', JSON.stringify(result, null, 2), function () {});
        //console.log(JSON.stringify(result));
        //console.log('Done');
    });
});

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
		console.log(prop);
		console.log()
		if (prop.indexOf(",") !== -1) prop = prop.split(",");
		else if (prop.indexOf(" ") !== -1) prop = prop.split(/\s+/);
		else prop = parseFloat(prop);
		
		if (typeof(prop) !== "number") {
			for (j = 0, ll = prop.length; j < ll; j++) {
				prop[j] = parseFloat(prop[j]);
			}
		}
		
		data[props[i]] = prop;
	}
}

function standardizeLegend (data) {
    if (!data.legend) return;

	var legend = data.legend;
	standardizeIntegers(legend, ["border", "rows", "columns", "cornerradius", "padding"]);
	standardizeDoubles(legend, ["opacity"]);
	standardizePositions(legend, ["anchor", "base", "position"]);
	if (legend.icon) standardizeIntegers(legend.icon, ["border", "height", "width"]);
} 
