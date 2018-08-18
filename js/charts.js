/* Developer: leo7044 (https://github.com/leo7044) */

function prepareDataForChart(_curObjectToUse, ArrayNeededItems)
{
    var returnData = [];
    for (var i = 0; i < _curObjectToUse.length; i++)
    {
        var tmpObjectWithNeededItems = {};
        for (var j = 0; j < ArrayNeededItems.length; j++)
        {
            tmpObjectWithNeededItems[ArrayNeededItems[j]] = _curObjectToUse[i][ArrayNeededItems[j]];
        }
        returnData.push(tmpObjectWithNeededItems);
    }
    return returnData;
}

function drawLineChart(_DataDiagram, _DivId)
{
    var ArrayKeys = [];
    for (var key in _DataDiagram[0])
    {
        ArrayKeys.push(key);
    }
    var ArrayGraphs = [];
    for (var i = 1; i < ArrayKeys.length; i++)
    {
        var ObjectCurGraph =
        {
            "id": "g" + i,
            "balloonText": "[[title]]<br/>[[value]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": ArrayKeys[i],
            "valueField": ArrayKeys[i],
            "useLineColorForBulletBorder": true,
            "balloon":{
                "drop":true
            }
        };
        ArrayGraphs.push(ObjectCurGraph);
    }
    var chart = AmCharts.makeChart(_DivId, {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": _DataDiagram,
        "valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left"
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": ArrayGraphs,
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g1",
            "scrollbarHeight": 40
        },
        "chartCursor": {
        "limitToGraph":"g1"
        },
        "categoryField": ArrayKeys[0],
        "categoryAxis": {
            "parseDates": true,
            "axisColor": "#DADADA",
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "legend": {
            "useGraphSettings": true,
            "forceWidth": true,
            "labelWidth": 110
        }
    });

    chart.addListener("rendered", zoomChart);
    zoomChart();
    function zoomChart()
    {
        chart.zoomToIndexes(_DataDiagram.length - 40, _DataDiagram.length - 1);
    }
}