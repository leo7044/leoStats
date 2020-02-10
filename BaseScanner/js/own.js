/* Developer: leo7044 (https://github.com/leo7044) */
var ArrayLayouts = [];

$(document).ready(function()
{
    getGetParas();
    setDefaultValues();
});

function setDefaultValues()
{
    MinDate.value = new Date(new Date().getTime() - 7 * 24 * 3600000).toISOString().split('T')[0];
    if ($_GET().WorldId != undefined)
    {
        WorldId.value = $_GET().WorldId;
    }
    /*var data =
    {
        action: 'getAlianceNamesByWorldId',
        worldId: WorldId.value
    }
    var dataAllianceName = null;
    $.ajaxSetup({async: false});
    $.post('../php/manageBackend.php', data)
    .always(function(data)
    {
        dataAllianceName = data;
    });
    $.ajaxSetup({async: true});
    var strHtml = '<option></option>';
    for (var key in dataAllianceName)
    {
        strHtml += '<option>' + dataAllianceName[key].AllianceName + '</option>';
    }
    SelectionAllianceName.innerHTML = strHtml;*/
}

function getLayoutsOrderByType(_type)
{
    var worldId = WorldId.value || 0;
    var minX = MinX.value || 0;
    var maxX = MaxX.value || 0;
    var minY = MinY.value || 0;
    var maxY = MaxY.value || 0;
    var minDate = MinDate.value || new Date(new Date().getTime() - 7 * 24 * 3600000).toISOString().split('T')[0];
    var playerName = PlayerName.value;
    var fieldsTib = FieldsTib.value || 0;
    var data =
    {
        action: 'getLayoutsByWorldIdAndProcedureName',
        worldId: worldId,
        procedureName: 'getLayoutsOrderBy' + _type,
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        MinDate: minDate,
        PlayerName: playerName,
        FieldsTib: fieldsTib
    };
    $.ajaxSetup({async: false});
    $.post('../php/manageBackend.php', data)
    .always(function(data)
    {
        ArrayLayouts = data;
        // console.log(data);
    });
    $.ajaxSetup({async: true});
    if (ArrayLayouts[1] == 'noLogin')
    {
        LoginState.innerHTML = 'Please login: <a href="https://cnc.indyserver.info/" target="_blank">https://cnc.indyserver.info/</a>';
        Scans.innerHTML = '';
    }
    else if (ArrayLayouts[1] == 'notAuthorized')
    {
        LoginState.innerHTML = 'You are not authorized.';
        Scans.innerHTML = '';
    }
    else
    {
        LoginState.innerHTML = '';
        drawLayouts();
    }
}

function drawLayouts()
{
    var strHtml = '';
    for (var key in ArrayLayouts)
    {
        var layoutArray = ArrayLayouts[key];
        var worldId = layoutArray['WorldId'];
        var zeit = layoutArray['Zeit'];
        var playerName = layoutArray['UserName'];
        var posX = layoutArray['PosX'];
        var posY = layoutArray['PosY'];
        var layout = layoutArray['Layout'];
        var cncOpt = layoutArray['CncOpt'];
        var layoutJson = JSON.parse(layout);
        strHtml +=
            '<div class="scan">' +
                '<div class="DivOneLayout">' +
                    '<table class="TableOneLayout">';
                    for (var y in layoutJson)
                    {
                        strHtml += '<tr>';
                        for (var x in layoutJson[y])
                        {
                            if (layoutJson[y][x])
                            {
                                strHtml += '<td><img src="img/' + layoutJson[y][x] + '.png"></td>';
                            }
                            else
                            {
                                strHtml += '<td></td>';
                            }
                        }
                        strHtml += '</tr>';
                    }
                    strHtml += '</table>' +
                    '<div class="DivContent">';
                        if (WorldId.value <= 0)
                        {
                            strHtml += 'WorldId: ' + worldId + '<br/>';
                        }
                        strHtml += 'Zeit: ' + zeit + '<br/>' +
                        'Coords: <a href="' + cncOpt + '" target="_blank" onclick="copyCoordsToClipcoard(' + posX + ', ' + posY + ');">' + posX + ':' + posY + '<br/></a>' +
                        'Scan by: ' + playerName + '<br/>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }
    $('#Scans')[0].innerHTML = strHtml;
}

function copyCoordsToClipcoard(_posX, _posY)
{
    $('#InputCoords')[0].value = '[coords]' + _posX + ':' + _posY + '[/coords]';
    $('#InputCoords')[0].hidden = false;
    var copyText = document.getElementById('InputCoords');
    copyText.select();
    document.execCommand("copy");
    $('#InputCoords')[0].hidden = true;
}

function getGetParas()
{
    var s = window.location.search.substring(1).split('&');
    if(!s.length) return;
    var c = {};
    for(var i  = 0; i < s.length; i++)
	{
        var parts = s[i].split('=');
        c[unescape(parts[0])] = unescape(parts[1]);
    }
    window.$_GET = function(name){return name ? c[name] : c;}
}