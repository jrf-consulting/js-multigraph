if (!window.multigraph) {
    window.multigraph = {};
}

if (!window.multigraph.Axis) {
    window.multigraph.Axis = {};
}

(function (ns) {
    "use strict";

    var scalarAttributes = ["start", "angle", "densityfactor"];

    ns.jQueryXMLMixin.add(function (nsObj, parse, serialize) {

        nsObj.Axis.Labels[parse] = function (xml, axis) {
            var labels = new nsObj.Axis.Labels(),
                labeler,
                spacing,
                spacingArray,
                i;
            if (xml) {
                labels.axis(axis);
                labels.formatter(xml.attr("format"));
                labels.start(xml.attr("start"));
                labels.angle(nsObj.utilityFunctions.parseDoubleOrUndefined(xml.attr("angle")));
                if (xml.attr("anchor") !== undefined) {
                    labels.anchor(nsObj.math.Point.parse(xml.attr("anchor")));
                }
                if (xml.attr("position") !== undefined) {
                    labels.position(nsObj.math.Point.parse(xml.attr("position")));
                }
                labels.densityfactor(nsObj.utilityFunctions.parseDoubleOrUndefined(xml.attr("densityfactor")));
                if (xml.attr("spacing") !== undefined) {
                    spacing = xml.attr("spacing");
                    labels.spacing(spacing);
                    spacingArray = spacing.split(/\s*/);
                    for (i = 0; i < spacingArray.length; i++) {
                        labeler = nsObj.Axis.Labeler[parse](xml, axis, labels);
                        labeler.spacing(spacingArray[i]);
                        axis.labelers().add( labeler );
                    }                    
                } else if (xml.find(">label").length > 0) {
                    $.each(xml.find(">label"), function (i,e) {
                        spacingArray = $(e).attr("spacing").split(/\s+/);
                        for (i = 0; i < spacingArray.length; i++) {
                            labeler = nsObj.Axis.Labeler[parse]($(e), axis, labels);
                            labeler.spacing(spacingArray[i]);
                            axis.labelers().add( labeler );
                        }
                    });
                }
            }
            return labels;
        };

        nsObj.Axis.Labels.prototype[serialize] = function () {
            var attributeStrings = [],
                output = '<labels ',
                i;

            attributeStrings = ns.utilityFunctions.serializeScalarAttributes(this, scalarAttributes, attributeStrings);
            if (this.formatter() !== undefined) {
                attributeStrings.push('format="' + this.formatter() + '"');
            }
            if (this.anchor() !== undefined) {
                attributeStrings.push('anchor="' + this.anchor().serialize() + '"');
            }
            if (this.position() !== undefined) {
                attributeStrings.push('position="' + this.position().serialize() + '"');
            }
            output += attributeStrings.join(' ');

            if (this.spacing() !== undefined) {
                output += ' spacing="' + this.spacing() + '"/>';
            } else if (this.axis().labelers().size() > 0) {
                output += '>';
                for (i = 0; i < this.axis().labelers().size(); i++) {
                    output += this.axis().labelers().at(i)[serialize]();
                }
                output += '</labels>';
            } else {
                output += '/>';
            }

            return output;
        };

    });
}(window.multigraph));