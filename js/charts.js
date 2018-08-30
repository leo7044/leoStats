/* Developer: leo7044 (https://github.com/leo7044) */

function prepareDataForLineChart(_curObjectToUse, _ArrayNeededItems)
{
    var returnData = [];
    for (var i = 0; i < _curObjectToUse.length; i++)
    {
        var tmpObjectWithNeededItems = {};
        for (var j = 0; j < _ArrayNeededItems.length; j++)
        {
            if (_ArrayNeededItems[j] == 'Rep' || _ArrayNeededItems[j] == 'RepMax')
            {
                tmpObjectWithNeededItems[_ArrayNeededItems[j]] = parseInt(parseInt(_curObjectToUse[i][_ArrayNeededItems[j]]) / 3600);
            }
            else
            {
                tmpObjectWithNeededItems[_ArrayNeededItems[j]] = _curObjectToUse[i][_ArrayNeededItems[j]];
            }
        }
        returnData.push(tmpObjectWithNeededItems);
    }
    return returnData;
}

function prepareDataForColumnChart(_curObjectToUse, _ArrayNeededItems)
{
    var returnData = [];
    for (var key in _curObjectToUse)
    {
        var tmpObject = {};
        tmpObject['LvL'] = key.slice(6, key.length);
        tmpObject['Amount'] = _curObjectToUse[key];
        returnData.push(tmpObject);
    }
    return returnData;
}

function drawLineChart(_DataDiagram, _DivId, _title)
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
            "balloonText": "[[title]]: [[value]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": ArrayKeys[i],
            "valueField": ArrayKeys[i],
            "useLineColorForBulletBorder": true
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
        "chartCursor": {},
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
            "labelWidth": 145
        },
        "titles": [{
            "text": _title,
            'size': 20
        }],
        "listeners":[{
            "event": "rendered",
            "method": function(e)
            {
                $('#LoadingSymbolPage').addClass('d-none');
            }
        }]
    });

    chart.addListener("rendered", zoomChart);
    zoomChart();
    function zoomChart()
    {
        chart.zoomToIndexes(_DataDiagram.length - 40, _DataDiagram.length - 1);
    }
}

function drawColumnChart(_DataDiagram, _DivId, _title, _categoryField, _valueField, _balloonText)
{
    var chart = AmCharts.makeChart(_DivId, {
        "type": "serial",
        "theme": "light",
        "marginRight": 70,
        "dataProvider": _DataDiagram,
        "valueAxes": [{
          "axisAlpha": 0,
          "position": "left"
        }],
        "graphs": [{
          "balloonText": _balloonText,
          "fillColorsField": "color",
          "fillAlphas": 0.9,
          "lineAlpha": 0.2,
          "type": "column",
          "valueField": _valueField
        }],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "categoryField": _categoryField,
        "categoryAxis": {
          "gridPosition": "start",
          "labelRotation": 45
        },
        "titles": [{
            "text": _title,
            'size': 20
        }],
        "listeners":[{
            "event": "rendered",
            "method": function(e)
            {
                $('#LoadingSymbolPage').addClass('d-none');
            }
        }]
    });
}