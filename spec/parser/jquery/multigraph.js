/*global describe, it, beforeEach, expect, xit, jasmine */
/*jshint laxbreak:true */

describe("Multigraph parsing", function () {
    "use strict";

    var Graph = window.multigraph.Graph,
        Multigraph = window.multigraph.core.Multigraph,
        mg,
        xmlString = '<mugl>'
        +     '<window'
        +         ' margin="1"'
        +         ' padding="10"'
        +         ' bordercolor="0x111223"'
        +         ' width="2"'
        +         ' height="97"'
        +         ' border="0"'
        +     '/>'
        +     '<legend'
        +         ' color="0x56839c"'
        +         ' bordercolor="0x941394"'
        +         ' base="-1,-1"'
        +         ' anchor="0,0"'
        +         ' position="0,0"'
        +         ' visible="true"'
        +         ' frame="padding"'
        +         ' opacity="1"'
        +         ' border="10"'
        +         ' rows="4"'
        +         ' columns="3"'
        +         ' cornerradius="5"'
        +         ' padding="4"'
        +         '>'
        +         '<icon'
        +             ' height="30"'
        +             ' width="40"'
        +             ' border="1"'
        +         '/>'
        +     '</legend>'
        +     '<background'
        +         ' color="0x123456"'
        +     '/>'
        +     '<plotarea'
        +         ' margintop="5"'
        +         ' marginleft="10"'
        +         ' marginbottom="19"'
        +         ' marginright="5"'
        +         ' bordercolor="0x111223"'
        +         ' border="0"'
        +     '/>'
        +     '<title'
        +         ' color="0xfffaab"'
        +         ' bordercolor="0x127752"'
        +         ' border="2"'
        +         ' opacity="0"'
        +         ' padding="4"'
        +         ' cornerradius="10"'
        +         ' base="0 0"'
        +         ' position="-1 1"'
        +         ' anchor="1 1"'
        +     '>'
        +         'Cool Cats'
        +     '</title>'
        +     '<horizontalaxis'
        +         ' color="0x123456"'
        +         ' id="x"'
        +         ' type="number"'
        +         ' pregap="2"'
        +         ' postgap="4"'
        +         ' anchor="1"'
        +         ' min="0"'
        +         ' minoffset="19"'
        +         ' max="10"'
        +         ' maxoffset="2"'
        +         ' positionbase="0 0"'
        +         ' tickmin="-3"'
        +         ' tickmax="3"'
        +         ' highlightstyle="bold"'
        +         ' linewidth="1"'
        +         ' length="1"'
        +         ' position="1,1"'
        +         ' base="1,-1"'
        +         ' minposition="-0.123"'
        +         ' maxposition="0.324"'
        +     '>'
        +         '<labels'
        +             ' start="0"'
        +             ' angle="0"'
        +             ' format="%1d"'
        +             ' anchor="0,0"'
        +             ' position="0,0"'
        +             ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +         '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +     '</horizontalaxis>'
        +     '<horizontalaxis'
        +         ' color="0x000000"'
        +         ' id="x2"'
        +         ' type="number"'
        +         ' pregap="2"'
        +         ' postgap="4"'
        +         ' anchor="1"'
        +         ' min="0"'
        +         ' minoffset="19"'
        +         ' max="10"'
        +         ' maxoffset="2"'
        +         ' positionbase="0 0"'
        +         ' tickmin="-3"'
        +         ' tickmax="3"'
        +         ' highlightstyle="bold"'
        +         ' linewidth="1"'
        +         ' length="1"'
        +         ' position="1,1"'
        +         ' base="1,-1"'
        +         ' minposition="-0.8"'
        +         ' maxposition="0.953"'
        +     '>'
        +         '<labels'
        +             ' start="0"'
        +             ' angle="0"'
        +             ' format="%1d"'
        +             ' anchor="0,0"'
        +             ' position="0,0"'
        +             ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +         '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +     '</horizontalaxis>'
        +     '<verticalaxis'
        +         ' color="0x123456"'
        +         ' id="y"'
        +         ' type="number"'
        +         ' pregap="2"'
        +         ' postgap="4"'
        +         ' anchor="1"'
        +         ' min="0"'
        +         ' minoffset="19"'
        +         ' max="10"'
        +         ' maxoffset="2"'
        +         ' positionbase="0 0"'
        +         ' tickmin="-3"'
        +         ' tickmax="3"'
        +         ' highlightstyle="bold"'
        +         ' linewidth="1"'
        +         ' length="1"'
        +         ' position="1,1"'
        +         ' base="1,-1"'
        +         ' minposition="0.1"'
        +         ' maxposition="0.9"'
        +     '>'
        +         '<labels'
        +             ' start="0"'
        +             ' angle="0"'
        +             ' format="%1d"'
        +             ' anchor="0,0"'
        +             ' position="0,0"'
        +             ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +         '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +     '</verticalaxis>'
        +     '<verticalaxis'
        +         ' color="0x123456"'
        +         ' id="y2"'
        +         ' type="number"'
        +         ' pregap="2"'
        +         ' postgap="4"'
        +         ' anchor="1"'
        +         ' min="0"'
        +         ' minoffset="19"'
        +         ' max="10"'
        +         ' maxoffset="2"'
        +         ' positionbase="0 0"'
        +         ' tickmin="-3"'
        +         ' tickmax="3"'
        +         ' highlightstyle="bold"'
        +         ' linewidth="1"'
        +         ' length="1"'
        +         ' position="1,1"'
        +         ' base="1,-1"'
        +         ' minposition="-0.3"'
        +         ' maxposition="1"'
        +     '>'
        +         '<labels'
        +             ' start="0"'
        +             ' angle="0"'
        +             ' format="%1d"'
        +             ' anchor="0,0"'
        +             ' position="0,0"'
        +             ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +         '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +     '</verticalaxis>'
        +     '<verticalaxis'
        +         ' color="0x123456"'
        +         ' id="y"'
        +         ' type="number"'
        +         ' pregap="2"'
        +         ' postgap="4"'
        +         ' anchor="1"'
        +         ' min="0"'
        +         ' minoffset="19"'
        +         ' max="10"'
        +         ' maxoffset="2"'
        +         ' positionbase="0 0"'
        +         ' tickmin="-3"'
        +         ' tickmax="3"'
        +         ' highlightstyle="bold"'
        +         ' linewidth="1"'
        +         ' length="1"'
        +         ' position="1,1"'
        +         ' base="1,-1"'
        +         ' minposition="0.1"'
        +         ' maxposition="0.9"'
        +     '>'
        +         '<labels'
        +             ' start="0"'
        +             ' angle="0"'
        +             ' format="%1d"'
        +             ' anchor="0,0"'
        +             ' position="0,0"'
        +             ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +         '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +     '</verticalaxis>'
        +     '<plot>'
        +         '<horizontalaxis'
        +             ' ref="x"'
        +             '>'
        +             '<variable'
        +                 ' ref="x"'
        +             '/>'
        +         '</horizontalaxis>'
        +         '<verticalaxis'
        +             ' ref="y"'
        +             '>'
        +             '<variable'
        +                 ' ref="y"'
        +             '/>'
        +         '</verticalaxis>'
        +         '<legend'
        +             ' visible="true"'
        +             ' label="y"'
        +         '/>'
        +     '</plot>'
        +     '<plot>'
        +         '<horizontalaxis'
        +             ' ref="x2"'
        +             '>'
        +             '<variable'
        +                 ' ref="x"'
        +             '/>'
        +         '</horizontalaxis>'
        +         '<verticalaxis'
        +             ' ref="y2"'
        +             '>'
        +             '<variable'
        +                 ' ref="y"'
        +             '/>'
        +         '</verticalaxis>'
        +         '<legend'
        +             ' visible="true"'
        +             ' label="y"'
        +         '/>'
        +     '</plot>'
        +     '<data>'
        +           '<variables>'
        +             '<variable id="x" column="0" type="number" missingvalue="-9000" missingop="le"/>'
        +             '<variable id="y" column="1" type="number" missingvalue="-9000" missingop="le"/>'
        +           '</variables>'
        +           '<values>'
        +             '1,2\n'
        +             '3,4\n'
        +             '5,6'
        +           '</values>'
        +     '</data>'
        + '</mugl>',
    xmlString2 = '<mugl>'
        +     '<graph>'
        +         '<window'
        +             ' margin="2"'
        +             ' padding="5"'
        +             ' bordercolor="0x000000"'
        +             ' border="2"'
        +         '/>'
        +         '<legend'
        +             ' color="0x56839c"'
        +             ' bordercolor="0x941394"'
        +             ' base="-1,-1"'
        +             ' anchor="0,0"'
        +             ' position="0,0"'
        +             ' visible="true"'
        +             ' frame="padding"'
        +             ' opacity="1"'
        +             ' border="10"'
        +             ' rows="4"'
        +             ' columns="3"'
        +             ' cornerradius="5"'
        +             ' padding="4"'
        +             '>'
        +             '<icon'
        +                 ' height="30"'
        +                 ' width="40"'
        +                 ' border="1"'
        +             '/>'
        +         '</legend>'
        +         '<background'
        +             ' color="0x123456"'
        +         '/>'
        +         '<plotarea'
        +             ' margintop="5"'
        +             ' marginleft="10"'
        +             ' marginbottom="19"'
        +             ' marginright="5"'
        +             ' bordercolor="0x111223"'
        +             ' border="0"'
        +         '/>'
        +         '<title'
        +             ' color="0xfffaab"'
        +             ' bordercolor="0x127752"'
        +             ' border="2"'
        +             ' opacity="0"'
        +             ' padding="4"'
        +             ' cornerradius="10"'
        +             ' base="0 0"'
        +             ' position="-1 1"'
        +             ' anchor="1 1">'
        +         'Cool Cats'
        +         '</title>'
        +         '<horizontalaxis'
        +             ' color="0x123456"'
        +             ' id="x"'
        +             ' type="number"'
        +             ' pregap="2"'
        +             ' postgap="4"'
        +             ' anchor="1"'
        +             ' min="0"'
        +             ' minoffset="19"'
        +             ' max="10"'
        +             ' maxoffset="2"'
        +             ' positionbase="0 0"'
        +             ' tickmin="-3"'
        +             ' tickmax="3"'
        +             ' highlightstyle="bold"'
        +             ' linewidth="1"'
        +             ' length="1"'
        +             ' position="1,1"'
        +             ' base="1,-1"'
        +             ' minposition="-0.9"'
        +             ' maxposition="0.6"'
        +         '>'
        +             '<labels'
        +                 ' start="0"'
        +                 ' angle="0"'
        +                 ' format="%1d"'
        +                 ' anchor="0,0"'
        +                 ' position="0,0"'
        +                 ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +             '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +         '</horizontalaxis>'
        +         '<horizontalaxis'
        +             ' color="0x123456"'
        +             ' id="x2"'
        +             ' type="number"'
        +             ' pregap="2"'
        +             ' postgap="4"'
        +             ' anchor="1"'
        +             ' min="0"'
        +             ' minoffset="19"'
        +             ' max="10"'
        +             ' maxoffset="2"'
        +             ' positionbase="0 0"'
        +             ' tickmin="-3"'
        +             ' tickmax="3"'
        +             ' highlightstyle="bold"'
        +             ' linewidth="1"'
        +             ' length="1"'
        +             ' position="1,1"'
        +             ' base="1,-1"'
        +             ' minposition="0.1"'
        +             ' maxposition="0.3"'
        +         '>'
        +             '<labels'
        +                 ' start="0"'
        +                 ' angle="0"'
        +                 ' format="%1d"'
        +                 ' anchor="0,0"'
        +                 ' position="0,0"'
        +                 ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +             '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +         '</horizontalaxis>'
        +         '<verticalaxis'
        +             ' color="0x000000"'
        +             ' id="y"'
        +             ' type="number"'
        +             ' pregap="2"'
        +             ' postgap="4"'
        +             ' anchor="1"'
        +             ' min="0"'
        +             ' minoffset="19"'
        +             ' max="10"'
        +             ' maxoffset="2"'
        +             ' positionbase="0 0"'
        +             ' tickmin="-3"'
        +             ' tickmax="3"'
        +             ' highlightstyle="bold"'
        +             ' linewidth="1"'
        +             ' length="1"'
        +             ' position="1,1"'
        +             ' base="1,-1"'
        +             ' minposition="0.2"'
        +             ' maxposition="0.4"'
        +         '>'
        +             '<labels'
        +                 ' start="0"'
        +                 ' angle="0"'
        +                 ' format="%1d"'
        +                 ' anchor="0,0"'
        +                 ' position="0,0"'
        +                 ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +             '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +         '</verticalaxis>'
        +         '<verticalaxis'
        +             ' color="0x1aa456"'
        +             ' id="y2"'
        +             ' type="number"'
        +             ' pregap="2"'
        +             ' postgap="4"'
        +             ' anchor="1"'
        +             ' min="0"'
        +             ' minoffset="19"'
        +             ' max="10"'
        +             ' maxoffset="2"'
        +             ' positionbase="0 0"'
        +             ' tickmin="-3"'
        +             ' tickmax="3"'
        +             ' highlightstyle="bold"'
        +             ' linewidth="1"'
        +             ' length="1"'
        +             ' position="1,1"'
        +             ' base="1,-1"'
        +             ' minposition="-0.34"'
        +             ' maxposition="0.87"'
        +         '>'
        +             '<labels'
        +                 ' start="0"'
        +                 ' angle="0"'
        +                 ' format="%1d"'
        +                 ' anchor="0,0"'
        +                 ' position="0,0"'
        +                 ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +             '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +         '</verticalaxis>'
        +         '<data>'
        +           '<variables>'
        +             '<variable id="x" column="0" type="number" missingvalue="-9000" missingop="le"/>'
        +             '<variable id="y" column="1" type="number" missingvalue="-9000" missingop="le"/>'
        +           '</variables>'
        +           '<values>'
        +             '1,2\n'
        +             '3,4\n'
        +             '5,6'
        +           '</values>'
        +         '</data>'
        +     '</graph>'
        +     '<graph>'
        +         '<window'
        +             ' margin="2"'
        +             ' padding="5"'
        +             ' bordercolor="0x000000"'
        +             ' border="2"'
        +         '/>'
        +         '<legend'
        +             ' color="0x56839c"'
        +             ' bordercolor="0x941394"'
        +             ' base="-1,-1"'
        +             ' anchor="0,0"'
        +             ' position="0,0"'
        +             ' visible="true"'
        +             ' frame="padding"'
        +             ' opacity="1"'
        +             ' border="10"'
        +             ' rows="4"'
        +             ' columns="3"'
        +             ' cornerradius="5"'
        +             ' padding="4"'
        +             '>'
        +             '<icon'
        +                 ' height="30"'
        +                 ' width="40"'
        +                 ' border="1"'
        +             '/>'
        +         '</legend>'
        +         '<background'
        +             ' color="0x123456"'
        +         '/>'
        +         '<plotarea'
        +             ' margintop="5"'
        +             ' marginleft="10"'
        +             ' marginbottom="19"'
        +             ' marginright="5"'
        +             ' bordercolor="0x111223"'
        +             ' border="0"'
        +         '/>'
        +         '<title'
        +             ' bordercolor="0x127752"'
        +             ' border="2"'
        +             ' opacity="0"'
        +             ' padding="4"'
        +             ' cornerradius="10"'
        +             ' base="0 0"'
        +             ' position="-1 1"'
        +             ' anchor="1 1"'
        +         '>'
        +             'Cool Cats'
        +         '</title>'
        +         '<horizontalaxis'
        +             ' color="0x123456"'
        +             ' id="x"'
        +             ' type="number"'
        +             ' pregap="2"'
        +             ' postgap="4"'
        +             ' anchor="1"'
        +             ' min="0"'
        +             ' minoffset="19"'
        +             ' max="10"'
        +             ' maxoffset="2"'
        +             ' positionbase="0 0"'
        +             ' tickmin="-3"'
        +             ' tickmax="3"'
        +             ' highlightstyle="bold"'
        +             ' linewidth="1"'
        +             ' length="1"'
        +             ' position="1,1"'
        +             ' base="1,-1"'
        +             ' minposition="0.14567"'
        +             ' maxposition="0.2"'
        +         '>'
        +             '<labels'
        +                 ' start="0"'
        +                 ' angle="0"'
        +                 ' format="%1d"'
        +                 ' anchor="0,0"'
        +                 ' position="0,0"'
        +                 ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +             '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +         '</horizontalaxis>'
        +         '<horizontalaxis'
        +             ' color="0x1234bb"'
        +             ' id="x2"'
        +             ' type="number"'
        +             ' pregap="2"'
        +             ' postgap="4"'
        +             ' anchor="1"'
        +             ' min="0"'
        +             ' minoffset="19"'
        +             ' max="10"'
        +             ' maxoffset="2"'
        +             ' positionbase="0 0"'
        +             ' tickmin="-3"'
        +             ' tickmax="3"'
        +             ' highlightstyle="bold"'
        +             ' linewidth="1"'
        +             ' length="1"'
        +             ' position="1,1"'
        +             ' base="1,-1"'
        +             ' minposition="0.3"'
        +             ' maxposition="0.4"'
        +         '>'
        +             '<labels'
        +                 ' start="0"'
        +                 ' angle="0"'
        +                 ' format="%1d"'
        +                 ' anchor="0,0"'
        +                 ' position="0,0"'
        +                 ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +             '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +         '</horizontalaxis>'
        +         '<verticalaxis'
        +             ' color="0x123456"'
        +             ' id="y"'
        +             ' type="number"'
        +             ' pregap="2"'
        +             ' postgap="4"'
        +             ' anchor="1"'
        +             ' min="0"'
        +             ' minoffset="19"'
        +             ' max="10"'
        +             ' maxoffset="2"'
        +             ' positionbase="0 0"'
        +             ' tickmin="-3"'
        +             ' tickmax="3"'
        +             ' highlightstyle="bold"'
        +             ' linewidth="1"'
        +             ' length="1"'
        +             ' position="1,1"'
        +             ' base="1,-1"'
        +             ' minposition="0"'
        +             ' maxposition="1"'
        +         '>'
        +             '<labels'
        +                 ' start="0"'
        +                 ' angle="0"'
        +                 ' format="%1d"'
        +                 ' anchor="0,0"'
        +                 ' position="0,0"'
        +                 ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +             '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +         '</verticalaxis>'
        +         '<verticalaxis'
        +             ' color="0xa23ff6"'
        +             ' id="y2"'
        +             ' type="number"'
        +             ' pregap="2"'
        +             ' postgap="4"'
        +             ' anchor="1"'
        +             ' min="0"'
        +             ' minoffset="19"'
        +             ' max="10"'
        +             ' maxoffset="2"'
        +             ' positionbase="0 0"'
        +             ' tickmin="-3"'
        +             ' tickmax="3"'
        +             ' highlightstyle="bold"'
        +             ' linewidth="1"'
        +             ' length="1"'
        +             ' position="1,1"'
        +             ' base="1,-1"'
        +             ' minposition="-0.34"'
        +             ' maxposition="0.98"'
        +         '>'
        +             '<labels'
        +                 ' start="0"'
        +                 ' angle="0"'
        +                 ' format="%1d"'
        +                 ' anchor="0,0"'
        +                 ' position="0,0"'
        +                 ' spacing="10000 5000 2000 1000 500 200 100 50 20 10 5 2 1 0.1 0.01 0.001"'
        +             '/>'
        +      '<grid color="0xeeeeee" visible="false"/>'
        +         '</verticalaxis>'
        +         '<data>'
        +           '<variables>'
        +             '<variable id="x" column="0" type="number" missingvalue="-9000" missingop="le"/>'
        +             '<variable id="y" column="1" type="number" missingvalue="-9000" missingop="le"/>'
        +           '</variables>'
        +           '<values>'
        +             '1,2\n'
        +             '3,4\n'
        +             '5,6'
        +           '</values>'
        +         '</data>'
        +     '</graph>'
        + '</mugl>',
        $xml;

    beforeEach(function () {
        window.multigraph.parser.jquery.mixin.apply(window.multigraph, "parseXML", "serialize");
        $xml = window.multigraph.parser.jquery.stringToJQueryXMLObj(xmlString);
        mg = Multigraph.parseXML($xml);
    });

    it("should be able to parse a multigraph from XML", function () {
        expect(mg).not.toBeUndefined();
        expect(mg instanceof Multigraph).toBe(true);
    });

    it("should be able to parse a multigraph from XML, then serialize it, and get the same XML as the original", function () {
        expect(mg.serialize()).toBe(xmlString);
        $xml = window.multigraph.parser.jquery.stringToJQueryXMLObj(xmlString2);
        mg = Multigraph.parseXML($xml);
        expect(mg.serialize()).toBe(xmlString2);
    });

});
