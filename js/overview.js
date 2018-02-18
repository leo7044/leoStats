/* Developer: leo7044 */
// (function(){
var ObjectSessionVariables = {};
// DropDown
var ArrayDropDownListData = [];
var ArrayDropDownListWorld = [];
var ArrayDropDownListAlliance = [];
var ArrayDropDownListPlayer = [];
var ArrayDropDownListBase = [];
var ArrayDropDownDefaultOwn = [];
// AllianceTabs
var ObjectAlliancePlayerData = {};
var ObjectAllianceData = {};
var ArrayAllianceCurScore = null;
var ArrayAllianceCurScoreIndexes = null;
var ArrayAllianceCurRank = null;
var ArrayAllianceCurRankIndexes = null;
var ArrayAllianceCurBonusRes = null;
var ArrayAllianceCurBonusResIndexes = null;
var ArrayAllianceCurBonusFight = null;
var ArrayAllianceCurBonusFightIndexes = null;
// PlayerTab
var ObjectPlayerData = {};
var ArrayPlayerCurScorePoints = null;
var ArrayPlayerCurScorePointsIndexes = null;
// PlayerBaseTab
var ObjectPlayerBaseData = {};
// BaseTab
var ObjectBaseData = {};
var ArrayBaseCurProduction = null;
var ArrayBaseCurProductionIndexes = null;
var ArrayBaseCurValues = null;
var ArrayBaseCurValuesIndexes = null;
var ArrayBaseCurRepairTime = null;
var ArrayBaseCurRepairTimeIndexes = null;

$(document).ready(function()
{
    getSessionVariables();
    prepairOnClickEvents();
    getDropDownListData();
    prepareandFillDropDownListDataWorld();
    if (getCookie('TabId'))
    {
        $('#' + getCookie('TabId')).click();
    }
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
        ObjectSessionVariables = data;
        if (ObjectSessionVariables.leoStats_IsAdmin)
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
    $('#TabPlayerBase').click(prepareTabPlayerBase);
    $('#TabAllianceMembers').click(prepareTabAllianceMembers);
    $('#TabAlliance').click(prepareTabAlliance);
    $('#TabAllianceBase').click(prepareTabAllianceBase);
    $('#TabBase').click(prepareTabBase);
    $('#TabWorld').click(prepareTabWorld);
    $('#DropDownListWorld').change(function(){prepareandFillDropDownListDataAlliance(true);});
    $('#DropDownListAlliance').change(function(){prepareandFillDropDownListDataPlayer(true);});
    $('#DropDownListPlayer').change(function(){prepareandFillDropDownListDataBase(true);});
    $('#DropDownListBase').change(function(){HelpFunctionForChangedBase(true);});
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

$(window).resize(function()
{
    if($('#TabAlliance.active')[0])
    {
        drawGoogleChartLine(ArrayAllianceCurScoreIndexes, ArrayAllianceCurScore);
        drawGoogleChartLine(ArrayAllianceCurRankIndexes, ArrayAllianceCurRank);
        drawGoogleChartLine(ArrayAllianceCurBonusResIndexes, ArrayAllianceCurBonusRes);
        drawGoogleChartLine(ArrayAllianceCurBonusFightIndexes, ArrayAllianceCurBonusFight);
    }
    if ($('#TabBase.active')[0])
    {
        drawGoogleChartLine(ArrayBaseCurProductionIndexes, ArrayBaseCurProduction);
        drawGoogleChartLine(ArrayBaseCurValuesIndexes, ArrayBaseCurValues);
        drawGoogleChartLine(ArrayBaseCurRepairTimeIndexes, ArrayBaseCurRepairTime);
    }
});

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
    if (getCookie('WorldId'))
    {
        $('#DropDownListWorld')[0].value = getCookie('WorldId');
    }
    prepareandFillDropDownListDataAlliance();
}

function prepareandFillDropDownListDataAlliance(_activeChanged)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    setCookie('WorldId', WorldId);
    ArrayDropDownListAlliance = alasql('SELECT DISTINCT AllianceId, AllianceName FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListAlliance)
    {
        strHtml += '<option value="' + ArrayDropDownListAlliance[key].AllianceId + '">' + ArrayDropDownListAlliance[key].AllianceName + '</option>';
    }
    $('#DropDownListAlliance')[0].innerHTML = strHtml;
    $('#DropDownListAlliance')[0].value = alasql('SELECT DISTINCT AllianceId FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownDefaultOwn])[0].AllianceId;
    if (_activeChanged)
    {
        prepareandFillDropDownListDataPlayer(_activeChanged);
    }
    else
    {
        if (getCookie('AllianceId'))
        {
            $('#DropDownListAlliance')[0].value = getCookie('AllianceId');
        }
        prepareandFillDropDownListDataPlayer();
    }
}

function prepareandFillDropDownListDataPlayer(_activeChanged)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    setCookie('AllianceId', AllianceId);
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
    if (_activeChanged)
    {
        prepareandFillDropDownListDataBase(_activeChanged);
    }
    else
    {
        if (getCookie('AccountId'))
        {
            $('#DropDownListPlayer')[0].value = getCookie('AccountId');
        }
        prepareandFillDropDownListDataBase();
    }
    if($('#TabAllianceMembers.active')[0])
    {
        manageContentAllianceMembers();
    }
    if($('#TabAlliance.active')[0])
    {
        manageContentAlliance();
    }
}

function prepareandFillDropDownListDataBase(_activeChanged)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
    setCookie('AccountId', AccountId);
    ArrayDropDownListBase = alasql('SELECT DISTINCT BaseId, Name FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '" AND AccountId="' + AccountId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListBase)
    {
        strHtml += '<option value="' + ArrayDropDownListBase[key].BaseId + '">' + ArrayDropDownListBase[key].Name + '</option>';
    }
    $('#DropDownListBase')[0].innerHTML = strHtml;
    if (_activeChanged)
    {
        HelpFunctionForChangedBase(_activeChanged);
    }
    else
    {
        if (getCookie('BaseId'))
        {
            $('#DropDownListBase')[0].value = getCookie('BaseId');
        }
        HelpFunctionForChangedBase();
    }
    if($('#TabPlayer.active')[0])
    {
        manageContentPlayer();
    }
    if($('#TabPlayerBase.active')[0])
    {
        manageContentPlayerBase();
    }
}

function HelpFunctionForChangedBase()
{
    var BaseId = $('#DropDownListBase')[0].value;
    setCookie('BaseId', BaseId);
    if($('#TabBase.active')[0])
    {
        manageContentBase();
    }
}

function changeBaseWithTableRowOnclick(_BaseId)
{
    $('#DropDownListBase')[0].value = _BaseId;
    $('#TabBase').click();
    HelpFunctionForChangedBase();
}

//==================================================
// Navigation with Tabs
//==================================================
function prepareTabPlayer()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentPlayer();
    setCookie('TabId', 'TabPlayer');
}

function prepareTabPlayerBase()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentPlayerBase();
    setCookie('TabId', 'TabPlayerBase');
}

function prepareTabAllianceMembers()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAllianceMembers();
    setCookie('TabId', 'TabAllianceMembers');
}

function prepareTabAlliance()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAlliance();
    setCookie('TabId', 'TabAlliance');
}

function prepareTabAllianceBase()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    setCookie('TabId', 'TabAllianceBase');
}

function prepareTabBase()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').removeClass('d-none');
    manageContentBase();
    setCookie('TabId', 'TabBase');
}

function prepareTabWorld()
{
    $('#DivDropDownListAlliance').addClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    setCookie('TabId', 'TabWorld');
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
                    strHtml += '<td>' + Intl.NumberFormat('en-US').format(parseInt(ObjectAlliancePlayerCur[keyPlayer][keyField])) + '</td>';
                }
                else
                {
                    strHtml += '<td>' + ObjectAlliancePlayerCur[keyPlayer][keyField] + '</td>';
                }
            }
        strHtml += '</tr>';
    }
    var ArrayRows = buildArrayTableBody('TableAlliancePlayer', ObjectAlliancePlayerCur, strHtml);
    resetDataTable('TableAlliancePlayer', ArrayRows);
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
    var ObjectAllianceCur = ObjectAllianceData[WorldId + '_' + AllianceId];
    ArrayAllianceCurScore = [];
    ArrayAllianceCurRank = [];
    ArrayAllianceCurBonusRes = [];
    ArrayAllianceCurBonusFight = [];
    ArrayAllianceCurScoreIndexes = ['Zeit', 'ScoreTib', 'ScoreCry', 'ScorePow', 'ScoreInf', 'ScoreVeh', 'ScoreAir', 'ScoreDef', 'AlliancePoints'];
    ArrayAllianceCurRankIndexes = ['Zeit', 'AllianceRank', 'EventRank', 'RankTib', 'RankCry', 'RankPow', 'RankInf', 'RankVeh', 'RankAir', 'RankDef', 'AllianceRank'];
    ArrayAllianceCurBonusResIndexes = ['Zeit', 'BonusTiberium', 'BonusCrystal', 'BonusPower', 'AllianceBonus - Ressoucen'];
    ArrayAllianceCurBonusFightIndexes = ['Zeit', 'BonusInfantrie', 'BonusVehicle', 'BonusAir', 'BonusDef', 'AllianceBonus - Fight'];
    for (var key in ObjectAllianceCur)
    {
        ArrayAllianceCurScore[key] = [];
        ArrayAllianceCurRank[key] = [];
        ArrayAllianceCurBonusRes[key] = [];
        ArrayAllianceCurBonusFight[key] = [];
        ArrayAllianceCurScore[key].push(ObjectAllianceCur[key][ArrayAllianceCurScoreIndexes[0]]);
        for (var i = 1; i < ArrayAllianceCurScoreIndexes.length - 1 ; i++)
        {
            ArrayAllianceCurScore[key].push(parseInt(ObjectAllianceCur[key][ArrayAllianceCurScoreIndexes[i]] * 100) / 100);
        }
        ArrayAllianceCurRank[key].push(ObjectAllianceCur[key][ArrayAllianceCurRankIndexes[0]]);
        for (var i = 1; i < ArrayAllianceCurRankIndexes.length - 1 ; i++)
        {
            ArrayAllianceCurRank[key].push(parseInt(ObjectAllianceCur[key][ArrayAllianceCurRankIndexes[i]] * 100) / 100);
        }
        ArrayAllianceCurBonusRes[key].push(ObjectAllianceCur[key][ArrayAllianceCurBonusResIndexes[0]]);
        for (var i = 1; i < ArrayAllianceCurBonusResIndexes.length - 1 ; i++)
        {
            ArrayAllianceCurBonusRes[key].push(parseInt(ObjectAllianceCur[key][ArrayAllianceCurBonusResIndexes[i]] * 100) / 100);
        }
        ArrayAllianceCurBonusFight[key].push(ObjectAllianceCur[key][ArrayAllianceCurBonusFightIndexes[0]]);
        for (var i = 1; i < ArrayAllianceCurBonusFightIndexes.length - 1 ; i++)
        {
            ArrayAllianceCurBonusFight[key].push(parseInt(ObjectAllianceCur[key][ArrayAllianceCurBonusFightIndexes[i]] * 100) / 100);
        }
    }
    setTimeout(function(){drawGoogleChartLine(ArrayAllianceCurScoreIndexes, ArrayAllianceCurScore);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayAllianceCurRankIndexes, ArrayAllianceCurRank);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayAllianceCurBonusResIndexes, ArrayAllianceCurBonusRes);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayAllianceCurBonusFightIndexes, ArrayAllianceCurBonusFight);}, 1);
}

//==================================================
// manage ContentPlayer
//==================================================
function manageContentPlayer()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
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
    ArrayPlayerCurScorePoints = [];
    ArrayPlayerCurScorePointsIndexes = ['Zeit', 'ScorePoints', 'AverageScore', 'Player - ScorePoints'];
    for (var key in ObjectPlayerCur)
    {
        ArrayPlayerCurScorePoints[key] = [];
        ArrayPlayerCurScorePoints[key].push(ObjectPlayerCur[key][ArrayPlayerCurScorePointsIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurScorePointsIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurScorePoints[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurScorePointsIndexes[i]] * 100) / 100);
        }
    }
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurScorePointsIndexes, ArrayPlayerCurScorePoints);}, 1);
}

//==================================================
// manage ContentPlayerBase
//==================================================
function manageContentPlayerBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
    if (!ObjectPlayerBaseData[WorldId + '_' + AccountId])
    {
        var data =
        {
            action: "getPlayerBaseData",
            WorldId: WorldId,
            AccountId: AccountId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectPlayerBaseData[WorldId + '_' + AccountId] = data;
        });
        $.ajaxSetup({async: true});
    }
    var ObjectPlayerBaseCur = ObjectPlayerBaseData[WorldId + '_' + AccountId];
    var strHtml = '';
    for (var key in ObjectPlayerBaseCur[0])
    {
        if (key != 'BaseId')
        {
            strHtml += '<th class="text-center">' + key + '</th>';
        }
    }
    if (!$('#TablePlayerBaseTheadTr')[0].innerHTML)
    {
        $('#TablePlayerBaseTheadTr')[0].innerHTML = strHtml;
    }
    ArrayPlayerBaseCurIds = [[], []];
    strHtml = '';
    for (var keyPlayer in ObjectPlayerBaseCur)
    {
        strHtml += '<tr id="' + ObjectPlayerBaseCur[keyPlayer]['BaseId'] + '">';
            for (var keyField in ObjectPlayerBaseCur[keyPlayer])
            {
                if (keyField == 'Rep')
                {
                    strHtml += '<td>' + ObjectPlayerBaseCur[keyPlayer][keyField].toTimeFormat() + '</td>';
                }
                else if (keyField == 'Tib' || keyField == 'Cry' || keyField == 'Pow' || keyField == 'Cre')
                {
                    strHtml += '<td>' + Intl.NumberFormat('en-US').format(parseInt(ObjectPlayerBaseCur[keyPlayer][keyField])) + '</td>';
                }
                else if (keyField == 'CnCOpt')
                {
                    strHtml += '<td><a href="' + ObjectPlayerBaseCur[keyPlayer][keyField] + '" target="_blank">' + ObjectPlayerBaseCur[keyPlayer]['Name'] + '</a></td>';
                }
                else if (keyField == 'BaseId')
                {
                    ArrayPlayerBaseCurIds[0].push(ObjectPlayerBaseCur[keyPlayer][keyField]);
                    ArrayPlayerBaseCurIds[1].push(ObjectPlayerBaseCur[keyPlayer]['Name']);
                    delete ObjectPlayerBaseCur[keyPlayer][keyField];
                }
                else
                {
                    strHtml += '<td>' + ObjectPlayerBaseCur[keyPlayer][keyField] + '</td>';
                }
            }
        strHtml += '</tr>';
    }
    var ArrayRows = buildArrayTableBody('TablePlayerBase', ObjectPlayerBaseCur, strHtml);
    resetDataTable('TablePlayerBase', ArrayRows, ArrayPlayerBaseCurIds);
    for (var keyPlayer in ObjectPlayerBaseCur)
    {
        ObjectPlayerBaseCur[keyPlayer]['BaseId'] = ArrayPlayerBaseCurIds[0][keyPlayer];
    }
}

//==================================================
// manage ContenBase
//==================================================
function manageContentBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var BaseId = $('#DropDownListBase')[0].value;
    if (!ObjectBaseData[WorldId + '_' + BaseId])
    {
        var data =
        {
            action: "getBaseData",
            WorldId: WorldId,
            BaseId: BaseId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectBaseData[WorldId + '_' + BaseId] = data;
        });
        $.ajaxSetup({async: true});
    }
    var ObjectBaseCur = ObjectBaseData[WorldId + '_' + BaseId];
    ArrayBaseCurProduction = [];
    ArrayBaseCurValues = [];
    ArrayBaseCurRepairTime = [];
    ArrayBaseCurProductionIndexes = ['Zeit', 'Tib', 'Cry', 'Pow', 'Cre', 'Base - Production'];
    ArrayBaseCurValuesIndexes = ['Zeit', 'LvLCY', 'LvLBase', 'LvLOff', 'LvLDef', 'LvLDF', 'LvLSup', 'Base - Values'];
    ArrayBaseCurRepairTimeIndexes = ['Zeit', 'Rep', 'RepMax', 'Base - RepairTime'];
    for (var key in ObjectBaseCur)
    {
        ArrayBaseCurProduction[key] = [];
        ArrayBaseCurValues[key] = [];
        ArrayBaseCurRepairTime[key] = [];
        ArrayBaseCurProduction[key].push(ObjectBaseCur[key][ArrayBaseCurProductionIndexes[0]]);
        for (var i = 1; i < ArrayBaseCurProductionIndexes.length - 1 ; i++)
        {
            ArrayBaseCurProduction[key].push(parseInt(ObjectBaseCur[key][ArrayBaseCurProductionIndexes[i]] * 100) / 100);
        }
        ArrayBaseCurValues[key].push(ObjectBaseCur[key][ArrayBaseCurValuesIndexes[0]]);
        for (var i = 1; i < ArrayBaseCurValuesIndexes.length - 1 ; i++)
        {
            ArrayBaseCurValues[key].push(parseInt(ObjectBaseCur[key][ArrayBaseCurValuesIndexes[i]] * 100) / 100);
        }
        ArrayBaseCurRepairTime[key].push(ObjectBaseCur[key][ArrayBaseCurRepairTimeIndexes[0]]);
        for (var i = 1; i < ArrayBaseCurRepairTimeIndexes.length - 1 ; i++)
        {
            ArrayBaseCurRepairTime[key].push(parseInt(ObjectBaseCur[key][ArrayBaseCurRepairTimeIndexes[i]] * 100) / 100);
        }
    }
    $('#LinkCncOpt')[0].href = ObjectBaseCur[countLength(ObjectBaseCur) - 1].CnCOpt;
    setTimeout(function(){drawGoogleChartLine(ArrayBaseCurProductionIndexes, ArrayBaseCurProduction);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayBaseCurValuesIndexes, ArrayBaseCurValues);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayBaseCurRepairTimeIndexes, ArrayBaseCurRepairTime);}, 1);
}

//==================================================
// optische Darstellungsmittel
//==================================================
function buildArrayTableBody(_Id, _Object, _strHtml)
{
    $('#' + _Id + 'Tbody')[0].innerHTML = _strHtml;
    var ArrayRows = [];
    for (var i = 0; i < countLength(_Object); i++)
    {
        var ArrayRow = [];
        for (var j = 0; j < countLength(_Object[i]); j++)
        {
            ArrayRow.push($('#' + _Id + 'Tbody')[0].children[i].children[j].innerHTML);
        }
        ArrayRows.push(ArrayRow);
    }
    return ArrayRows;
}

function resetDataTable(_Id, _ArrayRows, _ArrayPlayerBaseCurIds)
{
    if (!$('#' + _Id + '.dataTable')[0])
    {
        $('#' + _Id).DataTable({paging: false, order: [[1]]});
        $('.dataTables_info').parents()[1].remove();
        $('#' + _Id + '_wrapper').children()[1].style['overflow-x'] = 'auto';
        $('#TablePlayerBase_filter')[0].children[0].children[0].onkeyup = function(){prepareTabPlayerBase();}
    }
    $('#' + _Id).DataTable().clear();
    $('#' + _Id).DataTable().rows.add(_ArrayRows);
    $('#' + _Id).DataTable().draw();
    for (var i = 0; i < $('#' + _Id + 'Tbody')[0].children.length; i++)
    {
        if (_Id == 'TablePlayerBase')
        {
            for (var j = 1; j < $('#' + _Id + 'Tbody')[0].children[i].children.length - 1; j++)
            {
                $($('#' + _Id + 'Tbody')[0].children[i].children[j]).addClass('text-right');
            }
            var BaseName = $('#TablePlayerBaseTbody')[0].children[i].children[0].innerHTML;
            var BaseNameIndex = _ArrayPlayerBaseCurIds[1].indexOf(BaseName);
            $('#TablePlayerBaseTbody')[0].children[i].id = _ArrayPlayerBaseCurIds[0][BaseNameIndex];
            $('#TablePlayerBaseTbody')[0].children[i].onclick = function(data){changeBaseWithTableRowOnclick(data.path[1].id);};
            $('#TablePlayerBaseTbody')[0].children[i].style.cursor = 'pointer';
        }
        else
        {
            for (var j = 1; j < $('#' + _Id + 'Tbody')[0].children[i].children.length; j++)
            {
                $($('#' + _Id + 'Tbody')[0].children[i].children[j]).addClass('text-right');
            }
        }
    }
}

function drawGoogleChartLine(_ArrayIndexes, _ArrayCurChart)
{
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawCurveTypes);
    function drawCurveTypes()
    {
        var data = new google.visualization.DataTable();
        data.addColumn('string', _ArrayIndexes[i]);
        for (var i = 1; i < _ArrayIndexes.length - 1; i++)
        {
            data.addColumn('number', _ArrayIndexes[i]);
        }
        data.addRows(_ArrayCurChart);
        var options =
        {
            title: _ArrayIndexes[_ArrayIndexes.length - 1],
            hAxis:
            {
                title: 'Datum'
            },
            vAxis:
            {
                title: _ArrayIndexes[_ArrayIndexes.length - 1]
            }
        };
        var chart = new google.visualization.LineChart(document.getElementById('GoogleChartLine' + _ArrayIndexes[_ArrayIndexes.length - 1]));
        chart.draw(data, options);
    }
}

//==================================================
// Cookies for saving selected Ids
//==================================================
function setCookie(_name, _value)
{
    document.cookie = _name + '=' + _value + ';';
}

function getCookie(_name)
{
    var returnValue = '';
    var name = _name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ArrayDecodedCoocie = decodedCookie.split(';');
    for (var i = 0; i < ArrayDecodedCoocie.length; i++)
    {
        var cookieCur = ArrayDecodedCoocie[i];
        while (cookieCur.charAt(0) == ' ')
        {
            cookieCur = cookieCur.substring(1);
        }
        if (cookieCur.indexOf(name) == 0)
        {
            returnValue =  cookieCur.substring(name.length, cookieCur.length);
            break;
        }
    }
    return returnValue;
}
// })();