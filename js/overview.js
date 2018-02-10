/* Developer: leo7044 */
// (function(){
var ArraySessionVariables = [];
var ArrayDropDownListData = [];
var ArrayDropDownListWorld = [];
var ArrayDropDownListAlliance = [];
var ArrayDropDownListPlayer = [];
var ArrayDropDownListBase = [];
var ArrayDropDownDefaultOwn = [];
var ObjectAlliancePlayerData = {};
var ObjectAllianceData = {};

$(document).ready(function()
{
    getSessionVariables();
    prepairOnClickEvents();
    getDropDownListData();
    prepareandFillDropDownListDataWorld();
});

function getSessionVariables()
{
    var data =
    {
        action: "getSessionVariables"
    };
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        ArraySessionVariables = data;
        if (ArraySessionVariables.leoStats_IsAdmin)
        {
            $('#LiTabWorld').removeClass('d-none');
        }
    });
    $.ajaxSetup({async: true});
}

// reason: with "(function(){/* contentOfScript */})();" are no global variables accessable for user, additionally it will be more encrypted
function prepairOnClickEvents()
{
    $('#TabPlayer').click(prepareTabPlayer);
    $('#TabAllianceMembers').click(prepareTabAllianceMembers);
    $('#TabAlliance').click(prepareTabAlliance);
    $('#TabBases').click(prepareTabBases);
    $('#TabWorld').click(prepareTabWorld);
}

//==================================================
// Allgemeine Hilfsfunktionen
//==================================================
function countLength(obj)
{
    var count = 0;
    for(var prop in obj)
    {
        if(obj.hasOwnProperty(prop))
        {
            count++;
        }
    }
    return count;
}

String.prototype.toTimeFormat = function()
{
    var secs = parseInt(this);
    var hours   = Math.floor(secs / 3600);
    var minutes = ((0).toString() + Math.floor((secs - (hours * 3600)) / 60)).slice(-2);
    var seconds = ((0).toString() + (secs - (hours * 3600) - (minutes * 60))).slice(-2);
    if (hours < 10)
    {
        hours = '0' + hours
    }
    return hours + ':' + minutes + ':' + seconds;
}

//==================================================
// manage DropDownLists
//==================================================
function getDropDownListData()
{
    var data =
    {
        action: "getDropDownListData"
    };
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        ArrayDropDownListData = data[0];
        ArrayDropDownDefaultOwn = data[1];
    });
    $.ajaxSetup({async: true});
}

function prepareandFillDropDownListDataWorld()
{
    ArrayDropDownListWorld = alasql('SELECT DISTINCT WorldId, ServerName FROM ?',[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListWorld)
    {
        strHtml += '<option value="' + ArrayDropDownListWorld[key].WorldId + '">' + ArrayDropDownListWorld[key].ServerName + '</option>';
    }
    $('#DropDownListWorld')[0].innerHTML = strHtml;
    prepareandFillDropDownListDataAlliance();
}

function prepareandFillDropDownListDataAlliance()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    ArrayDropDownListAlliance = alasql('SELECT DISTINCT AllianceId, AllianceName FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListAlliance)
    {
        strHtml += '<option value="' + ArrayDropDownListAlliance[key].AllianceId + '">' + ArrayDropDownListAlliance[key].AllianceName + '</option>';
    }
    $('#DropDownListAlliance')[0].innerHTML = strHtml;
    $('#DropDownListAlliance')[0].value = alasql('SELECT DISTINCT AllianceId FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownDefaultOwn])[0].AllianceId;
    prepareandFillDropDownListDataPlayer();
}

function prepareandFillDropDownListDataPlayer()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    ArrayDropDownListPlayer = alasql('SELECT DISTINCT AccountId, UserName FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListPlayer)
    {
        strHtml += '<option value="' + ArrayDropDownListPlayer[key].AccountId + '">' + ArrayDropDownListPlayer[key].UserName + '</option>';
    }
    $('#DropDownListPlayer')[0].innerHTML = strHtml;
    var PlayerValue = alasql('SELECT DISTINCT AccountId FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId +'"' ,[ArrayDropDownDefaultOwn])[0];
    if (PlayerValue)
    {
        $('#DropDownListPlayer')[0].value = PlayerValue.AccountId;
    }
    prepareandFillDropDownListDataBase();
    if($('#TabAllianceMembers.active')[0])
    {
        manageContentAllianceMembers();
    }
    if($('#TabAlliance.active')[0])
    {
        manageContentAlliance();
    }
}

function prepareandFillDropDownListDataBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
    ArrayDropDownListBase = alasql('SELECT DISTINCT BaseId, Name FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '" AND AccountId="' + AccountId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListBase)
    {
        strHtml += '<option value="' + ArrayDropDownListBase[key].BaseId + '">' + ArrayDropDownListBase[key].Name + '</option>';
    }
    $('#DropDownListBase')[0].innerHTML = strHtml;
}

//==================================================
// Navigation with Tabs
//==================================================
function prepareTabPlayer()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
}

function prepareTabAllianceMembers()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAllianceMembers();
}

function prepareTabAlliance()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAlliance();
}

function prepareTabBases()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').removeClass('d-none');
}

function prepareTabWorld()
{
    $('#DivDropDownListAlliance').addClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
}

//==================================================
// manage ContentAllianceMembers and ContentAlliance
//==================================================
function manageContentAllianceMembers()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    // if (!ObjectAlliancePlayerData[WorldId + '_' + AllianceId] || !ObjectAlliancePlayerData[WorldId + '_' + AllianceId][0])
    if (!ObjectAlliancePlayerData[WorldId + '_' + AllianceId])
    {
        var data =
        {
            action: "getAlliancePlayerData",
            WorldId: WorldId,
            AllianceId: AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectAlliancePlayerData[WorldId + '_' + AllianceId] = data;
        });
        $.ajaxSetup({async: true});
    }
    var ObjectAlliancePlayerCur = ObjectAlliancePlayerData[WorldId + '_' + AllianceId];
    var strHtml = '';
    for (var key in ObjectAlliancePlayerCur[0])
    {
        strHtml += '<th class="text-center">' + key + '</th>';
    }
    if (!$('#TableAlliancePlayerTheadTr')[0].innerHTML)
    {
        $('#TableAlliancePlayerTheadTr')[0].innerHTML = strHtml;
    }
    $('#TableAlliancePlayerTheadTr')[0].children[1].style.minWidth = '64px';
    strHtml = '';
    for (var keyPlayer in ObjectAlliancePlayerCur)
    {
        strHtml += '<tr>';
            for (var keyField in ObjectAlliancePlayerCur[keyPlayer])
            {
                if (keyField == 'RepMax')
                {
                    strHtml += '<td>' + ObjectAlliancePlayerCur[keyPlayer][keyField].toTimeFormat() + '</td>';
                }
                else if (!isNaN(parseInt(ObjectAlliancePlayerCur[keyPlayer][keyField])) && keyField != 'Zeit')
                {
                    strHtml += '<td>' + parseInt(ObjectAlliancePlayerCur[keyPlayer][keyField]).toLocaleString() + '</td>';
                }
                else
                {
                    strHtml += '<td>' + ObjectAlliancePlayerCur[keyPlayer][keyField] + '</td>';
                }
            }
        strHtml += '</tr>';
    }
    $('#TableAlliancePlayerTbody')[0].innerHTML = strHtml;
    var ArrayRows = [];
    for (var i = 0; i < countLength(ObjectAlliancePlayerCur); i++)
    {
        var ArrayRow = [];
        for (var j = 0; j < countLength(ObjectAlliancePlayerCur[i]); j++)
        {
            ArrayRow.push($('#TableAlliancePlayerTbody')[0].children[i].children[j].innerHTML);
        }
        ArrayRows.push(ArrayRow);
    }
    resetDataTableAlliancePlayer(ArrayRows);
}

function resetDataTableAlliancePlayer(_ArrayRows)
{
    if (!$('#TableAlliancePlayer.dataTable')[0])
    {
        $('#TableAlliancePlayer').DataTable({paging: false});
        $('.dataTables_info').parents()[1].remove();
        $('#TableAlliancePlayer_wrapper').children()[1].style['overflow-x'] = 'auto';
    }
    $('#TableAlliancePlayer').DataTable().clear();
    $('#TableAlliancePlayer').DataTable().rows.add(_ArrayRows);
    $('#TableAlliancePlayer').DataTable().draw();
    for (var i = 0; i < $('#TableAlliancePlayerTbody')[0].children.length; i++)
    {
        for (var j = 1; j < $('#TableAlliancePlayerTbody')[0].children[i].children.length; j++)
        {
            $($('#TableAlliancePlayerTbody')[0].children[i].children[j]).addClass('text-right');
        }
    }
}

function manageContentAlliance()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    if (!ObjectAllianceData[WorldId + '_' + AllianceId])
    {
        var data =
        {
            action: "getAllianceData",
            WorldId: WorldId,
            AllianceId: AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectAllianceData[WorldId + '_' + AllianceId] = data;
        });
        $.ajaxSetup({async: true});
    }
}
// })();