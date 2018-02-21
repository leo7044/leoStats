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
var ArrayPlayerCurRank = null;
var ArrayPlayerCurRankIndexes = null;
var ArrayPlayerCurProduction = null;
var ArrayPlayerCurProductionIndexes = null;
var ArrayPlayerCurRpsCred = null;
var ArrayPlayerCurRpsCredIndexes = null;
var ArrayPlayerCurShoots = null;
var ArrayPlayerCurShootsIndexes = null;
var ArrayPlayerCurValues = null;
var ArrayPlayerCurValuesIndexes = null;
var ArrayPlayerCurVps = null;
var ArrayPlayerCurVpsIndexes = null;
var ArrayPlayerCurLps = null;
var ArrayPlayerCurLpsIndexes = null;
var ArrayPlayerCurCps = null;
var ArrayPlayerCurCpsIndexes = null;
var ArrayPlayerCurFunds = null;
var ArrayPlayerCurFundsIndexes = null;
// AllianceBaseTab
var ObjectAllianceBaseData = {};
var ArrayAllianceBaseCurOff = null;
var ArrayAllianceBaseCurOffIndexes = null;
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
// WorldTab
var ObjectWorldBaseData = {};
var ArrayWorldBaseCurOff = null;
var ArrayWorldBaseCurOffIndexes = null;

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
            $('#LiTabWorldBase').removeClass('d-none');
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
    $('#TabWorldBase').click(prepareTabWorldBase);
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
    else if ($('#TabBase.active')[0])
    {
        drawGoogleChartLine(ArrayBaseCurProductionIndexes, ArrayBaseCurProduction);
        drawGoogleChartLine(ArrayBaseCurValuesIndexes, ArrayBaseCurValues);
        drawGoogleChartLine(ArrayBaseCurRepairTimeIndexes, ArrayBaseCurRepairTime);
    }
    else if ($('#TabPlayer.active')[0])
    {
        drawGoogleChartLine(ArrayPlayerCurScorePointsIndexes, ArrayPlayerCurScorePoints);
        drawGoogleChartLine(ArrayPlayerCurRankIndexes, ArrayPlayerCurRank);
        drawGoogleChartLine(ArrayPlayerCurProductionIndexes, ArrayPlayerCurProduction);
        drawGoogleChartLine(ArrayPlayerCurRpsCredIndexes, ArrayPlayerCurRpsCred);
        drawGoogleChartLine(ArrayPlayerCurShootsIndexes, ArrayPlayerCurShoots);
        drawGoogleChartLine(ArrayPlayerCurValuesIndexes, ArrayPlayerCurValues);
        drawGoogleChartLine(ArrayPlayerCurVpsIndexes, ArrayPlayerCurVps);
        drawGoogleChartLine(ArrayPlayerCurLpsIndexes, ArrayPlayerCurLps);
        drawGoogleChartLine(ArrayPlayerCurCpsIndexes, ArrayPlayerCurCps);
        drawGoogleChartLine(ArrayPlayerCurFundsIndexes, ArrayPlayerCurFunds);
    }
    else if ($('#TabAllianceBase.active')[0])
    {
        drawGoogleChartColumn(ArrayAllianceBaseCurOffIndexes, ArrayAllianceBaseCurOff);
    }
    else if ($('#TabWorldBase.active')[0])
    {
        drawGoogleChartColumn(ArrayWorldBaseCurOffIndexes, ArrayWorldBaseCurOff);
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
    if($('#TabAllianceBase.active')[0])
    {
        manageContentAllianceBase();
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

function changePlayerWithTableRowOnclick(_AccountId)
{
    $('#DropDownListPlayer')[0].value = _AccountId;
    $('#TabPlayerBase').click();
    prepareandFillDropDownListDataBase(true);
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
    manageContentAllianceBase();
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

function prepareTabWorldBase()
{
    $('#DivDropDownListAlliance').addClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentWorldBase();
    setCookie('TabId', 'TabWorldBase');
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
    ObjectAlliancePlayerCur = ObjectAlliancePlayerData[WorldId + '_' + AllianceId];
    var strHtml = '';
    for (var key in ObjectAlliancePlayerCur[0])
    {
        if (key != 'AccountId')
        {
            strHtml += '<th class="text-center">' + key + '</th>';
        }
    }
    if (!$('#TableAlliancePlayerTheadTr')[0].innerHTML)
    {
        $('#TableAlliancePlayerTheadTr')[0].innerHTML = strHtml;
    }
    $('#TableAlliancePlayerTheadTr')[0].children[1].style.minWidth = '64px';
    var ArrayAlliancePlayerCurIdsAndNames = [[], []];
    strHtml = '';
    for (var keyPlayer in ObjectAlliancePlayerCur)
    {
        strHtml += '<tr>';
            for (var keyField in ObjectAlliancePlayerCur[keyPlayer])
            {
                if (keyField == 'AccountId')
                {
                    ArrayAlliancePlayerCurIdsAndNames[0].push(ObjectAlliancePlayerCur[keyPlayer][keyField]);
                    ArrayAlliancePlayerCurIdsAndNames[1].push(ObjectAlliancePlayerCur[keyPlayer]['UserName']);
                    delete ObjectAlliancePlayerCur[keyPlayer][keyField];
                }
                else if (keyField == 'RepMax')
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
    resetDataTable('TableAlliancePlayer', ArrayRows, ArrayAlliancePlayerCurIdsAndNames);
    for (var keyPlayer in ObjectAlliancePlayerCur)
    {
        ObjectAlliancePlayerCur[keyPlayer]['AccountId'] = ArrayAlliancePlayerCurIdsAndNames[0][keyPlayer];
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
    ArrayPlayerCurRank = [];
    ArrayPlayerCurProduction = [];
    ArrayPlayerCurRpsCred = [];
    ArrayPlayerCurShoots = [];
    ArrayPlayerCurValues = [];
    ArrayPlayerCurVps = [];
    ArrayPlayerCurLps = [];
    ArrayPlayerCurCps = [];
    ArrayPlayerCurFunds = [];
    ArrayPlayerCurScorePointsIndexes = ['Zeit', 'ScorePoints', 'AverageScore', 'Player - ScorePoints'];
    ArrayPlayerCurRankIndexes = ['Zeit', 'OverallRank', 'EventRank', 'Player - Ranking'];
    ArrayPlayerCurProductionIndexes = ['Zeit', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits', 'Player - Production'];
    ArrayPlayerCurRpsCredIndexes = ['Zeit', 'ResearchPoints', 'Credits', 'Player - RPs / Credits'];
    ArrayPlayerCurShootsIndexes = ['Zeit', 'Shoot', 'PvP', 'PvE', 'Player - Shoots'];
    ArrayPlayerCurValuesIndexes = ['Zeit', 'BaseD', 'LvLOff', 'OffD', 'DefD', 'DFD', 'SupD', 'Player - Values'];
    ArrayPlayerCurVpsIndexes = ['Zeit', 'VP', 'Player - VPs'];
    ArrayPlayerCurLpsIndexes = ['Zeit', 'LP', 'Player - LPs'];
    ArrayPlayerCurCpsIndexes = ['Zeit', 'CPMax', 'CPCur', 'Player - CPs'];
    ArrayPlayerCurFundsIndexes = ['Zeit', 'Funds', 'Player - Funds'];
    for (var key in ObjectPlayerCur)
    {
        ArrayPlayerCurScorePoints[key] = [];
        ArrayPlayerCurRank[key] = [];
        ArrayPlayerCurProduction[key] = [];
        ArrayPlayerCurRpsCred[key] = [];
        ArrayPlayerCurShoots[key] = [];
        ArrayPlayerCurValues[key] = [];
        ArrayPlayerCurVps[key] = [];
        ArrayPlayerCurLps[key] = [];
        ArrayPlayerCurCps[key] = [];
        ArrayPlayerCurFunds[key] = [];
        ArrayPlayerCurScorePoints[key].push(ObjectPlayerCur[key][ArrayPlayerCurScorePointsIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurScorePointsIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurScorePoints[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurScorePointsIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurRank[key].push(ObjectPlayerCur[key][ArrayPlayerCurRankIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurRankIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurRank[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurRankIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurProduction[key].push(ObjectPlayerCur[key][ArrayPlayerCurProductionIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurProductionIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurProduction[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurProductionIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurRpsCred[key].push(ObjectPlayerCur[key][ArrayPlayerCurRpsCredIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurRpsCredIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurRpsCred[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurRpsCredIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurShoots[key].push(ObjectPlayerCur[key][ArrayPlayerCurShootsIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurShootsIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurShoots[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurShootsIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurValues[key].push(ObjectPlayerCur[key][ArrayPlayerCurValuesIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurValuesIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurValues[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurValuesIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurVps[key].push(ObjectPlayerCur[key][ArrayPlayerCurVpsIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurVpsIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurVps[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurVpsIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurLps[key].push(ObjectPlayerCur[key][ArrayPlayerCurLpsIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurLpsIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurLps[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurLpsIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurCps[key].push(ObjectPlayerCur[key][ArrayPlayerCurCpsIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurCpsIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurCps[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurCpsIndexes[i]] * 100) / 100);
        }
        ArrayPlayerCurFunds[key].push(ObjectPlayerCur[key][ArrayPlayerCurFundsIndexes[0]]);
        for (var i = 1; i < ArrayPlayerCurFundsIndexes.length - 1 ; i++)
        {
            ArrayPlayerCurFunds[key].push(parseInt(ObjectPlayerCur[key][ArrayPlayerCurFundsIndexes[i]] * 100) / 100);
        }
    }
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurScorePointsIndexes, ArrayPlayerCurScorePoints);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurRankIndexes, ArrayPlayerCurRank);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurProductionIndexes, ArrayPlayerCurProduction);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurRpsCredIndexes, ArrayPlayerCurRpsCred);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurShootsIndexes, ArrayPlayerCurShoots);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurValuesIndexes, ArrayPlayerCurValues);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurVpsIndexes, ArrayPlayerCurVps);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurLpsIndexes, ArrayPlayerCurLps);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurCpsIndexes, ArrayPlayerCurCps);}, 1);
    setTimeout(function(){drawGoogleChartLine(ArrayPlayerCurFundsIndexes, ArrayPlayerCurFunds);}, 1);
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
    var ArrayPlayerBaseCurIdsAndNames = [[], []];
    strHtml = '';
    for (var keyBase in ObjectPlayerBaseCur)
    {
        strHtml += '<tr id="' + ObjectPlayerBaseCur[keyBase]['BaseId'] + '">';
            for (var keyField in ObjectPlayerBaseCur[keyBase])
            {
                if (keyField == 'Rep')
                {
                    strHtml += '<td>' + ObjectPlayerBaseCur[keyBase][keyField].toTimeFormat() + '</td>';
                }
                else if (keyField == 'Tib' || keyField == 'Cry' || keyField == 'Pow' || keyField == 'Cre')
                {
                    strHtml += '<td>' + Intl.NumberFormat('en-US').format(parseInt(ObjectPlayerBaseCur[keyBase][keyField])) + '</td>';
                }
                else if (keyField == 'CnCOpt')
                {
                    strHtml += '<td><a href="' + ObjectPlayerBaseCur[keyBase][keyField] + '" target="_blank">' + ObjectPlayerBaseCur[keyBase]['Name'] + '</a></td>';
                }
                else if (keyField == 'BaseId')
                {
                    ArrayPlayerBaseCurIdsAndNames[0].push(ObjectPlayerBaseCur[keyBase][keyField]);
                    ArrayPlayerBaseCurIdsAndNames[1].push(ObjectPlayerBaseCur[keyBase]['Name']);
                    delete ObjectPlayerBaseCur[keyBase][keyField];
                }
                else
                {
                    strHtml += '<td>' + ObjectPlayerBaseCur[keyBase][keyField] + '</td>';
                }
            }
        strHtml += '</tr>';
    }
    var ArrayRows = buildArrayTableBody('TablePlayerBase', ObjectPlayerBaseCur, strHtml);
    resetDataTable('TablePlayerBase', ArrayRows, ArrayPlayerBaseCurIdsAndNames);
    for (var keyBase in ObjectPlayerBaseCur)
    {
        ObjectPlayerBaseCur[keyBase]['BaseId'] = ArrayPlayerBaseCurIdsAndNames[0][keyBase];
    }
}

//==================================================
// manage ContentAllianceBase
//==================================================
function manageContentAllianceBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    if (!ObjectAllianceBaseData[WorldId + '_' + AllianceId])
    {
        var data =
        {
            action: "getAllianceBaseData",
            WorldId: WorldId,
            AllianceId: AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectAllianceBaseData[WorldId + '_' + AllianceId] = data;
        });
        $.ajaxSetup({async: true});
    }
    var ObjectAllianceBaseCur = ObjectAllianceBaseData[WorldId + '_' + AllianceId];
    ArrayAllianceBaseCurOff = [];
    ArrayAllianceBaseCurOffIndexes = [];
    for (var i = 0; i <= 67; i++)
    {
        ArrayAllianceBaseCurOffIndexes.push(i);
    }
    ArrayAllianceBaseCurOffIndexes.push('Alliance - Offense');
    var i = j = 0;
    for (var key in ObjectAllianceBaseCur)
    {
        if (parseInt(ObjectAllianceBaseCur[key]))
        {
            ArrayAllianceBaseCurOff[j] = [];
            ArrayAllianceBaseCurOff[j].push(parseInt(ArrayAllianceBaseCurOffIndexes[i]));
            ArrayAllianceBaseCurOff[j].push(parseInt(ObjectAllianceBaseCur[key]));
            ArrayAllianceBaseCurOff.push(ArrayAllianceBaseCurOff[j]);
            j++;
        }
        i++;
    }
    ArrayAllianceBaseCurOff.pop();
    setTimeout(function(){drawGoogleChartColumn(ArrayAllianceBaseCurOffIndexes, ArrayAllianceBaseCurOff);}, 1);
}

//==================================================
// manage ContentBase
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
// manage ContentWorldBase
//==================================================
function manageContentWorldBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    if (!ObjectWorldBaseData[WorldId.toString()])
    {
        var data =
        {
            action: "getWorldBaseData",
            WorldId: WorldId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectWorldBaseData[WorldId.toString()] = data;
        });
        $.ajaxSetup({async: true});
    }
    var ObjectWorldBaseCur = ObjectWorldBaseData[WorldId.toString()];
    ArrayWorldBaseCurOff = [];
    ArrayWorldBaseCurOffIndexes = [];
    for (var i = 0; i <= 67; i++)
    {
        ArrayWorldBaseCurOffIndexes.push(i);
    }
    ArrayWorldBaseCurOffIndexes.push('World - Offense');
    var i = j = 0;
    for (var key in ObjectWorldBaseCur)
    {
        if (parseInt(ObjectWorldBaseCur[key]))
        {
            ArrayWorldBaseCurOff[j] = [];
            ArrayWorldBaseCurOff[j].push(parseInt(ArrayWorldBaseCurOffIndexes[i]));
            ArrayWorldBaseCurOff[j].push(parseInt(ObjectWorldBaseCur[key]));
            ArrayWorldBaseCurOff.push(ArrayWorldBaseCurOff[j]);
            j++;
        }
        i++;
    }
    ArrayWorldBaseCurOff.pop();
    setTimeout(function(){drawGoogleChartColumn(ArrayWorldBaseCurOffIndexes, ArrayWorldBaseCurOff);}, 1);
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

function resetDataTable(_Id, _ArrayRows, _ArrayIdsAndNames)
{
    if (!$('#' + _Id + '.dataTable')[0])
    {
        $('#' + _Id).DataTable({paging: false, order: [[1]]});
        $('.dataTables_info').parents()[1].remove();
        $('#' + _Id + '_wrapper').children()[1].style['overflow-x'] = 'auto';
        if (_Id == 'TablePlayerBase')
        {
            $('#TablePlayerBase_filter')[0].children[0].children[0].onkeyup = function(){prepareTabPlayerBase();}
        }
        else if (_Id == 'TableAlliancePlayer')
        {
            $('#TableAlliancePlayer_filter')[0].children[0].children[0].onkeyup = function(){prepareTabPlayer();}
        }
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
        }
        else if (_Id == 'TableAlliancePlayer')
        {
            for (var j = 1; j < $('#' + _Id + 'Tbody')[0].children[i].children.length; j++)
            {
                $($('#' + _Id + 'Tbody')[0].children[i].children[j]).addClass('text-right');
            }
        }
        var Name = $('#' + _Id + 'Tbody')[0].children[i].children[0].innerHTML;
        var NameIndex = _ArrayIdsAndNames[1].indexOf(Name);
        $('#' + _Id + 'Tbody')[0].children[i].id = _ArrayIdsAndNames[0][NameIndex];
        $('#' + _Id + 'Tbody')[0].children[i].style.cursor = 'pointer';
        if (_Id == 'TablePlayerBase')
        {
            $('#' + _Id + 'Tbody')[0].children[i].onclick = function(data){changeBaseWithTableRowOnclick(data.path[1].id);};
        }
        else if (_Id == 'TableAlliancePlayer')
        {
            $('#' + _Id + 'Tbody')[0].children[i].onclick = function(data){changePlayerWithTableRowOnclick(data.path[1].id);};
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

function drawGoogleChartColumn(_ArrayIndexes, _ArrayCurChart)
{
    _ArrayCurChart.unshift(["Level", "Count"]);
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart()
    {
        var data = google.visualization.arrayToDataTable(_ArrayCurChart);
        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1]);
        var options =
        {
            title: _ArrayIndexes[_ArrayIndexes.length - 1]
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('GoogleChartColumn' + _ArrayIndexes[_ArrayIndexes.length - 1]));
        chart.draw(view, options);
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