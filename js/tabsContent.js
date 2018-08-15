/* Developer: leo7044 (https://github.com/leo7044) */

var ObjectPlayerData = {};

function manageContentPlayer()
{
    var WorldId = $('#DropDownListWorld').val();
    var AccountId = $('#DropDownListPlayer').val();
    if (!ObjectPlayerData[WorldId + '_' + AccountId])
    {
        var data =
        {
            action: "getPlayerData",
            WorldId: WorldId,
            AccountId: AccountId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectPlayerData[WorldId + '_' + AccountId] = data;
        });
        $.ajaxSetup({async: true});
    }
    var ObjectPlayerCur = ObjectPlayerData[WorldId + '_' + AccountId];
    var DataDiagram = [];
    for (var i = 0; i < ObjectPlayerCur.length; i++)
    {
        var tmpObject = {};
        tmpObject['Zeit'] = ObjectPlayerCur[i]['Zeit'];
        tmpObject['ScorePoints'] = ObjectPlayerCur[i]['ScorePoints'];
        tmpObject['AverageScore'] = ObjectPlayerCur[i]['AverageScore'];
        DataDiagram.push(tmpObject);
    }
    var chartData = DataDiagram;
    var chart = AmCharts.makeChart("ChartPlayer-ScorePoints", {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData,
        "valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left"
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g1",
            "balloonText": "[[value]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "ScorePoints",
            "valueField": "ScorePoints",
            "useLineColorForBulletBorder": true,
            "balloon":{
                "drop":true
            }
        },
        {
            "id": "g2",
            "balloonText": "[[value]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "AverageScore",
            "valueField": "AverageScore",
            "useLineColorForBulletBorder": true,
            "balloon":{
                "drop":true
            }
        }],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g1",
            "scrollbarHeight": 40
        },
        "chartCursor": {
        "limitToGraph":"g1"
        },
        "categoryField": "Zeit",
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
        chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
    }
}

function manageContentPlayerBase()
{

}

function manageContentAllianceMembers()
{

}

function manageContentAlliance()
{

}

function manageContentAllianceBase()
{

}

function manageContentAllianceOverview()
{

}

function manageContentBase()
{

}

function manageContentWorldOverview()
{

}

function manageContentSettingsPlayer()
{

}

function manageContentSettingsAlliance()
{

}

function manageContentSettingsServer()
{

}