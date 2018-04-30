/* Developer: leo7044 */
var ObjectSessionVariables = null;
var ArraySeasonServerIds = null;
// DropDown
var ArrayDropDownListData = null;
var ArrayDropDownDefaultOwn = null;
var ObjectNeededMemberRoles = {};
// Tabs
var ObjectPlayerData = {};
var ObjectPlayerBaseData = {};
var ObjectAlliancePlayerData = {};
var ObjectAllianceData = {};
var ObjectAllianceBaseData = {};
var ObjectAllianceOverviewData = {};
var ObjectBaseData = {};
var ObjectWorldOverviewData = {};
// DiagramData
var ObjectDiagramData = {};
var indexWorldId = 0;
var ArrayAdminLog = null;;

$(document).ready(function()
{
    initializeStart();
});

function initializeStart()
{
    getSessionVariables();
    getSeasonServerIds();
    getDropDownListData();
    prepareandFillDropDownListDataWorld();
    if (getCookie('TabId'))
    {
        $('#' + getCookie('TabId')).click();
    }
}

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
            $('#LiTabWorldOverview').removeClass('d-none');
        }
    });
    $.ajaxSetup({async: true});
}

function getSeasonServerIds()
{
    var data =
    {
        action: "getSeasonServerIds"
    };
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        ArraySeasonServerIds = data;
    });
    $.ajaxSetup({async: true});
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
        for (var keyDiagramType in ObjectDiagramData.Alliance)
        {
            drawGoogleChartLine(ObjectDiagramData.Alliance[keyDiagramType][1], ObjectDiagramData.Alliance[keyDiagramType][0]);
        }
    }
    else if ($('#TabBase.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.Base)
        {
            drawGoogleChartLine(ObjectDiagramData.Base[keyDiagramType][1], ObjectDiagramData.Base[keyDiagramType][0]);
        }
    }
    else if ($('#TabPlayer.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.Player)
        {
            drawGoogleChartLine(ObjectDiagramData.Player[keyDiagramType][1], ObjectDiagramData.Player[keyDiagramType][0]);
        }
    }
    else if ($('#TabAllianceOverview.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.OverviewAlliance)
        {
            drawGoogleChartColumn(ObjectDiagramData.OverviewAlliance[keyDiagramType][1], ObjectDiagramData.OverviewAlliance[keyDiagramType][0]);
        }
    }
    else if ($('#TabWorldOverview.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.OverviewWorld)
        {
            drawGoogleChartColumn(ObjectDiagramData.OverviewWorld[keyDiagramType][1], ObjectDiagramData.OverviewWorld[keyDiagramType][0]);
        }
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
    var ArrayDropDownListWorld = alasql('SELECT DISTINCT WorldId, ServerName FROM ?',[ArrayDropDownListData]);
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
    var ArrayDropDownListAlliance = alasql('SELECT DISTINCT AllianceId, AllianceName FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListAlliance)
    {
        strHtml += '<option value="' + ArrayDropDownListAlliance[key].AllianceId + '">' + ArrayDropDownListAlliance[key].AllianceName + '</option>';
    }
    $('#DropDownListAlliance')[0].innerHTML = strHtml;
    var AllianceValue = alasql('SELECT DISTINCT AllianceId FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownDefaultOwn])[0];
    if (AllianceValue)
    {
        $('#DropDownListAlliance')[0].value = AllianceValue.AllianceId;
    }
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
    if($('#TabWorldOverview.active')[0])
    {
        manageContentWorldOverview();
    }
}

function prepareandFillDropDownListDataPlayer(_activeChanged)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    setCookie('AllianceId', AllianceId);
    var ArrayDropDownListPlayer = alasql('SELECT DISTINCT AccountId, UserName FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '"' ,[ArrayDropDownListData]);
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
        resetViewSettingsTabs();
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
    if($('#TabAllianceOverview.active')[0])
    {
        manageContentAllianceOverview();
    }
}

function prepareandFillDropDownListDataBase(_activeChanged)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
    setCookie('AccountId', AccountId);
    var ArrayDropDownListBase = alasql('SELECT DISTINCT BaseId, Name FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '" AND AccountId="' + AccountId + '"' ,[ArrayDropDownListData]);
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
    if($('#TabSettings.active')[0])
    {
        manageContentSettings();
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

function prepareTabAllianceOverview()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAllianceOverview();
    setCookie('TabId', 'TabAllianceOverview');
}

function prepareTabBase()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').removeClass('d-none');
    manageContentBase();
    setCookie('TabId', 'TabBase');
}

function prepareTabWorldOverview()
{
    $('#DivDropDownListAlliance').addClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentWorldOverview();
    setCookie('TabId', 'TabWorldOverview');
}

function prepareTabSettings()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    if (ObjectSessionVariables.leoStats_IsAdmin)
    {
        $('#DivDropDownListPlayer').removeClass('d-none');
    }
    else
    {
        $('#DivDropDownListPlayer').addClass('d-none');
        // setzt den eigenen Account als ausgewählt, damit im eigenen Spieler rumgefuhrwerkt wird
        // theoretisch ist das egal, aber für die Admin-Verwaltung ist es leichter, wenn auf die AccountId zugegriffen wird des derzeit ausgewählten Spielers
        $('#DropDownListPlayer')[0].value = ObjectSessionVariables.leoStats_AccountId;
    }
    $('#DivDropDownListBase').addClass('d-none');
    manageContentSettings();
    setCookie('TabId', 'TabSettings');
}

//==================================================
// manage ContentOfTabs
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
    var ArrayExcludedFieldsFromUsNumberFormat = ['UserName', 'Zeit', 'LvLOff', 'BaseD', 'OffD', 'DefD', 'DFD', 'SupD'];
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
            else if (!isNaN(parseInt(ObjectAlliancePlayerCur[keyPlayer][keyField])) && ArrayExcludedFieldsFromUsNumberFormat.indexOf(keyField) == -1)
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
    resetDataTable('TableAlliancePlayer', ArrayRows, ArrayAlliancePlayerCurIdsAndNames, true);
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
    ObjectDiagramData.Alliance = {};
    ObjectDiagramData.Alliance.Score = [[], ['Zeit', 'ScoreTib', 'ScoreCry', 'ScorePow', 'ScoreInf', 'ScoreVeh', 'ScoreAir', 'ScoreDef', 'AlliancePoints']];
    if (ArraySeasonServerIds.indexOf(WorldId) != -1)
    {
        ObjectDiagramData.Alliance.Rank = [[], ['Zeit', 'AllianceRank', 'EventRank', 'RankTib', 'RankCry', 'RankPow', 'RankInf', 'RankVeh', 'RankAir', 'RankDef', 'AllianceRank']];
    }
    else
    {
        ObjectDiagramData.Alliance.Rank = [[], ['Zeit', 'AllianceRank', 'RankTib', 'RankCry', 'RankPow', 'RankInf', 'RankVeh', 'RankAir', 'RankDef', 'AllianceRank']];
    }
    ObjectDiagramData.Alliance.BonusRes = [[], ['Zeit', 'BonusTiberium', 'BonusCrystal', 'BonusPower', 'AllianceBonus - Ressoucen']];
    ObjectDiagramData.Alliance.BonusFight = [[], ['Zeit', 'BonusInfantrie', 'BonusVehicle', 'BonusAir', 'BonusDef', 'AllianceBonus - Fight']];
    drawDiagrams(ObjectAllianceCur, 'Alliance');
}

function manageContentAllianceBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var type = $('#DropDownAllianceBaseType')[0].value;
    if (!ObjectAllianceBaseData[WorldId + '_' + AllianceId])
    {
        ObjectAllianceBaseData[WorldId + '_' + AllianceId] = {};
    }
    if (!ObjectAllianceBaseData[WorldId + '_' + AllianceId][type])
    {
        var data =
        {
            action: "getAllianceBaseData",
            WorldId: WorldId,
            AllianceId: AllianceId,
            type: type
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectAllianceBaseData[WorldId + '_' + AllianceId][type] = data;
        });
        $.ajaxSetup({async: true});
    }
    var curObjectAllianceBaseData = ObjectAllianceBaseData[WorldId + '_' + AllianceId][type];
    var maxBaseCount = 0;
    var curBaseCount = 0;
    var lastName = '';
    var nameCount = 0;
    for (key in curObjectAllianceBaseData)
    {
        if (curObjectAllianceBaseData[key]['UserName'] != lastName)
        {
            curBaseCount = 0;
            nameCount++;
        }
        lastName = curObjectAllianceBaseData[key]['UserName'];
        curBaseCount++;
        if (curBaseCount > maxBaseCount)
        {
            maxBaseCount = curBaseCount;
        }
    }
    var strHtml = '<th onclick="sortTable(0, \'TableAllianceBase\', \'asc\')">PlayerName</th>';
    for (var i = 1; i <= maxBaseCount; i++)
    {
        strHtml += '<th style="text-align: center;" onclick="sortTable(' + i + ', \'TableAllianceBase\', \'desc\')">Base ' + i + '</th>';
    }
    $('#TableAllianceBaseTheadTr')[0].innerHTML = strHtml;
    lastName = '';
    curBaseCount = 1;
    var nameCount = -1;
    var maxLvL = alasql('SELECT MAX(' + type + ') FROM ?',[curObjectAllianceBaseData])[0]['MAX(' + type + ')'];
    var ArrayColors =
    [
        '#33CC33', '#44CC33', '#55CC33', '#66CC33', '#77CC33',
        '#88CC33', '#99CC33', '#AACC33', '#BBCC33', '#CCCC33',
        '#CCBB33', '#CCAA33', '#CC9933', '#CC8833', '#CC7733',
        '#CC6633', '#CC5533', '#CC4433', '#CC3333'
    ];
    var curColor = '';
    strHtml = '';
    for (var key in curObjectAllianceBaseData)
    {
        if (curObjectAllianceBaseData[key]['UserName'] != lastName)
        {
            if (key != 0)
            {
                nameCount++;
                while (curBaseCount <= maxBaseCount)
                {
                    strHtml += '<td></td>';
                    curBaseCount ++;
                }
                curBaseCount = 1;
                strHtml += '</tr><tr><td>' + curObjectAllianceBaseData[key]['UserName'] + '</td>';
            }
            else
            {
                strHtml += '<tr><td>' + curObjectAllianceBaseData[key]['UserName'] + '</td>';
            }
        }
        var procentLvLOff = parseFloat(curObjectAllianceBaseData[key][type]) / parseFloat(maxLvL);
        if (procentLvLOff >= 0.99){curColor = ArrayColors[0];}
        else if (procentLvLOff >= 0.98){curColor = ArrayColors[1];}
        else if (procentLvLOff >= 0.97){curColor = ArrayColors[2];}
        else if (procentLvLOff >= 0.96){curColor = ArrayColors[3];}
        else if (procentLvLOff >= 0.95){curColor = ArrayColors[4];}
        else if (procentLvLOff >= 0.94){curColor = ArrayColors[5];}
        else if (procentLvLOff >= 0.93){curColor = ArrayColors[6];}
        else if (procentLvLOff >= 0.92){curColor = ArrayColors[7];}
        else if (procentLvLOff >= 0.91){curColor = ArrayColors[8];}
        else if (procentLvLOff >= 0.90){curColor = ArrayColors[9];}
        else if (procentLvLOff >= 0.80){curColor = ArrayColors[10];}
        else if (procentLvLOff >= 0.70){curColor = ArrayColors[11];}
        else if (procentLvLOff >= 0.60){curColor = ArrayColors[12];}
        else if (procentLvLOff >= 0.50){curColor = ArrayColors[13];}
        else if (procentLvLOff >= 0.40){curColor = ArrayColors[14];}
        else if (procentLvLOff >= 0.30){curColor = ArrayColors[15];}
        else if (procentLvLOff >= 0.20){curColor = ArrayColors[16];}
        else if (procentLvLOff >= 0.10){curColor = ArrayColors[17];}
        else if (procentLvLOff >= 0.00){curColor = ArrayColors[18];}
        else {curColor = '';}
        strHtml += '<td style="text-align: right; background-color: ' + curColor + ';">' + curObjectAllianceBaseData[key][type] + '</td>';
        lastName = curObjectAllianceBaseData[key]['UserName'];
        curBaseCount++;
        if (key == curObjectAllianceBaseData.length -1)
        {
            while (curBaseCount <= maxBaseCount)
            {
                strHtml += '<td></td>';
                curBaseCount ++;
            }
        }
    }
    strHtml += '</tr>';
    $('#TableAllianceBaseTbody')[0].innerHTML = strHtml;
}

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
    ObjectDiagramData.Player = {};
    ObjectDiagramData.Player.ScorePoints = [[0], ['Zeit', 'ScorePoints', 'AverageScore', 'Player - ScorePoints']];
    if (ArraySeasonServerIds.indexOf(WorldId) != -1)
    {
        ObjectDiagramData.Player.Rank = [[0], ['Zeit', 'OverallRank', 'EventRank', 'Player - Ranking']];
    }
    else
    {
        ObjectDiagramData.Player.Rank = [[0], ['Zeit', 'OverallRank', 'Player - Ranking']];
    }
    ObjectDiagramData.Player.Production = [[0], ['Zeit', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits', 'Player - Production']];
    ObjectDiagramData.Player.RpsCred = [[0], ['Zeit', 'ResearchPoints', 'Credits', 'Player - RPs / Credits']];
    ObjectDiagramData.Player.Shoots = [[0], ['Zeit', 'Shoot', 'PvP', 'PvE', 'Player - Shoots']];
    ObjectDiagramData.Player.Values = [[0], ['Zeit', 'BaseD', 'LvLOff', 'OffD', 'DefD', 'DFD', 'SupD', 'Player - Values']];
    if (ArraySeasonServerIds.indexOf(WorldId) != -1)
    {
        document.getElementById('GoogleChartLinePlayer - VPs').className = 'divGoogleChart';
        document.getElementById('GoogleChartLinePlayer - LPs').className = 'divGoogleChart';
        ObjectDiagramData.Player.Vps = [[0], ['Zeit', 'VP', 'Player - VPs']];
        ObjectDiagramData.Player.Lps = [[0], ['Zeit', 'LP', 'Player - LPs']];
    }
    else
    {
        document.getElementById('GoogleChartLinePlayer - VPs').className = 'd-none';
        document.getElementById('GoogleChartLinePlayer - LPs').className = 'd-none';
    }
    ObjectDiagramData.Player.Cps = [[0], ['Zeit', 'CPMax', 'CPCur', 'Player - CPs']];
    ObjectDiagramData.Player.Funds = [[0], ['Zeit', 'Funds', 'Player - Funds']];
    drawDiagrams(ObjectPlayerCur, 'Player');
}

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

function manageContentAllianceOverview()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    if (!ObjectAllianceOverviewData[WorldId + '_' + AllianceId])
    {
        var data =
        {
            action: "getAllianceOverviewData",
            WorldId: WorldId,
            AllianceId: AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectAllianceOverviewData[WorldId + '_' + AllianceId] = data;
        });
        $.ajaxSetup({async: true});
    }
    var ObjectAllianceOverviewCurOff = ObjectAllianceOverviewData[WorldId + '_' + AllianceId][0];
    var ObjectAllianceOverviewCurDef = ObjectAllianceOverviewData[WorldId + '_' + AllianceId][1];
    var ObjectAllianceOverviewCurSup = ObjectAllianceOverviewData[WorldId + '_' + AllianceId][2];
    createOverviews(ObjectAllianceOverviewCurOff, 'OverviewAlliance', 'Alliance', 'Offense');
    createOverviews(ObjectAllianceOverviewCurDef, 'OverviewAlliance', 'Alliance', 'Defense');
    createOverviews(ObjectAllianceOverviewCurSup, 'OverviewAlliance', 'Alliance', 'Support');
    drawOverviews('OverviewAlliance');
}

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
    ObjectDiagramData.Base = {};
    ObjectDiagramData.Base.Production = [[], ['Zeit', 'Tib', 'Cry', 'Pow', 'Cre', 'Base - Production']];
    ObjectDiagramData.Base.Values = [[], ['Zeit', 'LvLCY', 'LvLBase', 'LvLOff', 'LvLDef', 'LvLDF', 'LvLSup', 'Base - Values']];
    ObjectDiagramData.Base.RepairTime = [[], ['Zeit', 'Rep', 'RepMax', 'Base - RepairTime']];
    var tmpArrayForRep = [];
    for (var key in ObjectBaseCur)
    {
        tmpArrayForRep[key] = [];
        tmpArrayForRep[key][0] = ObjectBaseCur[key].Rep;
        tmpArrayForRep[key][1] = ObjectBaseCur[key].RepMax;
        ObjectBaseCur[key].Rep = ObjectBaseCur[key].Rep / 3600;
        ObjectBaseCur[key].RepMax = ObjectBaseCur[key].RepMax / 3600;
    }
    drawDiagrams(ObjectBaseCur, 'Base');
    for (var key in ObjectBaseCur)
    {
        ObjectBaseCur[key].Rep = tmpArrayForRep[key][0];
        ObjectBaseCur[key].RepMax = tmpArrayForRep[key][1];
    }
    $('#LinkCncOpt')[0].href = ObjectBaseCur[countLength(ObjectBaseCur) - 1].CnCOpt;
}

function manageContentWorldOverview()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    if (!ObjectWorldOverviewData[WorldId.toString()])
    {
        var data =
        {
            action: "getWorldOverviewData",
            WorldId: WorldId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectWorldOverviewData[WorldId.toString()] = data;
        });
        $.ajaxSetup({async: true});
    }
    var ObjectWorldOverviewCurOff = ObjectWorldOverviewData[WorldId.toString()][0];
    var ObjectWorldOverviewCurDef = ObjectWorldOverviewData[WorldId.toString()][1];
    var ObjectWorldOverviewCurSup = ObjectWorldOverviewData[WorldId.toString()][2];
    createOverviews(ObjectWorldOverviewCurOff, 'OverviewWorld', 'World', 'Offense');
    createOverviews(ObjectWorldOverviewCurDef, 'OverviewWorld', 'World', 'Defense');
    createOverviews(ObjectWorldOverviewCurSup, 'OverviewWorld', 'World', 'Support');
    drawOverviews('OverviewWorld');
}

//==================================================
// Administration & settings
//==================================================

function manageContentSettings()
{
    if (!ObjectSessionVariables.leoStats_IsAdmin)
    {
        for (var i = 0; i < ArrayDropDownDefaultOwn.length; i++)
        {
            if (ArrayDropDownDefaultOwn[i].WorldId == $('#DropDownListWorld')[0].value)
            {
                indexWorldId = i;
                break;
            }
        }
    }
    if (ObjectSessionVariables.leoStats_IsAdmin)
    {
        $('#v-pills-alliance-tab').removeClass('d-none');
        $('#v-pills-server-tab').removeClass('d-none');
        $('#AdminButtonsPlayer').removeClass('d-none');
    }
    else if (ArrayDropDownDefaultOwn[indexWorldId].MemberRole == 1)
    {
        $('#v-pills-alliance-tab').removeClass('d-none');
    }
    else
    {
        $('#v-pills-alliance-tab').addClass('d-none');
    }
    resetFormChangePassword(true);
}

function resetViewSettingsTabs()
{
    $('#v-pills-player-tab').addClass('active show');
    $('#v-pills-alliance-tab').removeClass('active show');
    $('#v-pills-server-tab').removeClass('active show');
    $('#v-pills-player').addClass('active show');
    $('#v-pills-alliance').removeClass('active show');
    $('#v-pills-server').removeClass('active show');
}

function changePassword()
{
    var ownAccountId = ObjectSessionVariables.leoStats_AccountId;
    var dataUrl = 'action=changePassword&AccountId=' + ownAccountId + '&' + $('#FormChangePassword').serialize();
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', dataUrl)
    .always(function(data)
    {
        if (data[0])
        {
            $('#PasswordChangeFail').addClass('d-none');
            $('#PasswordChangeSuccess').removeClass('d-none');
            resetFormChangePassword();
        }
        else
        {
            $('#PasswordChangeFail').removeClass('d-none');
            $('#PasswordChangeSuccess').addClass('d-none');
        }
    });
    $.ajaxSetup({async: true});
    return false;
}

function resetFormChangePassword(_activeClicked)
{
    document.forms.FormChangePassword.reset();
    if (_activeClicked)
    {
        $('#PasswordChangeFail').addClass('d-none');
        $('#PasswordChangeSuccess').addClass('d-none');
    }
    $('#InputUserName')[0].value = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML
}

function validatePassword()
{
    if ($('#InputNewPassword')[0].value != $('#InputConfirmNewPassword')[0].value)
    {
        $('#InputConfirmNewPassword')[0].setCustomValidity("Passwords do not match");
    }
    else
    {
        $('#InputConfirmNewPassword')[0].setCustomValidity('');
    }
}

function resetPlayer()
{
    var playerName = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML
    if (confirm('Do you want reset player ' + playerName + '?'))
    {
        var AccountId = $('#DropDownListPlayer')[0].value;
        var data =
        {
            action: "resetPlayer",
            Id: AccountId,
            PlayerName: playerName
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
    }
}

function deletePlayer()
{
    var playerName = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML
    if (confirm('Do you want to delete player ' + playerName + ' from database?'))
    {
        var AccountId = $('#DropDownListPlayer')[0].value;
        var data =
        {
            action: "deletePlayer",
            Id: AccountId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
        initializeStart();
    }
}

function prepareSettingsAlliance()
{
    if (ObjectSessionVariables.leoStats_IsAdmin)
    {
        var WorldId = $('#DropDownListWorld')[0].value;
        var AllianceId = $('#DropDownListAlliance')[0].value;
        getNeededMemberRoles(WorldId, AllianceId);
        $('#DropDownListMemberRole')[0].selectedIndex = ObjectNeededMemberRoles[WorldId + '_' + AllianceId].MemberRole - 1;
    }
    else
    {
        $('#DropDownListMemberRole')[0].selectedIndex = ArrayDropDownDefaultOwn[indexWorldId].NeededMemberRole - 1;
    }
    var strHtml = '<tr>';
    for (var i = 0; i < $('#DropDownListPlayer')[0].length; i++)
    {
        strHtml +=
            '<td id="TableCell_' + $('#DropDownListPlayer')[0].options[i].value + '">' +
                '<span id="TableCellName_' + $('#DropDownListPlayer')[0].options[i].value + '">' +
                    $('#DropDownListPlayer')[0].options[i].innerHTML +
                '</span>' +
                '<button class="btn btn-light float-right" onclick="deletePlayerTableCell(\'TableCell_' + $('#DropDownListPlayer')[0].options[i].value + '\');">' +
                    '<font color="#FF0000;">' +
                        '<i class="fas fa-times"></i>' +
                    '</font>' +
                '</button>' +
            '</td>';
        if (!((i + 1) % 5))
        {
            strHtml += '</tr><tr>';
        }
    }
    strHtml += '</tr>';
    $('#TableSettingsAlliancePlayerTBody')[0].innerHTML = strHtml;
    $('#MemberRoleChangeFail').addClass('d-none');
    $('#MemberRoleChangeSuccess').addClass('d-none');
}

function prepareSettingsServer()
{
    $('#TableAdminLog').DataTable().destroy();
    getAdminLog();
    prepareAdminLogTable();
}

function saveChangeNeededMemberRole()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var MemberRole = $('#DropDownListMemberRole')[0].value;
    var data =
    {
        action: "changeNeededMemberRole",
        WorldId: WorldId,
        AllianceId: AllianceId,
        MemberRole: MemberRole
    }
    var success = false;
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        if (data[0])
        {
            $('#MemberRoleChangeFail').addClass('d-none');
            $('#MemberRoleChangeSuccess').removeClass('d-none');
            if (ObjectSessionVariables.leoStats_IsAdmin)
            {
                ObjectNeededMemberRoles[WorldId + '_' + AllianceId].MemberRole = $('#DropDownListMemberRole')[0].selectedIndex + 1;
            }
            else
            {
                ArrayDropDownDefaultOwn[indexWorldId].NeededMemberRole = $('#DropDownListMemberRole')[0].value;
            }
        }
        else
        {
            $('#MemberRoleChangeFail').removeClass('d-none');
            $('#MemberRoleChangeSuccess').addClass('d-none');
        }
    });
    $.ajaxSetup({async: true});
}

function getNeededMemberRoles(_WorldId, _AllianceId)
{
    if (!ObjectNeededMemberRoles[_WorldId + '_' + _AllianceId])
    {
        var data =
        {
            action: "getNeededMemberRoles",
            WorldId: _WorldId,
            AllianceId: _AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(data)
        {
            ObjectNeededMemberRoles[_WorldId + '_' + _AllianceId] = data;
        });
        $.ajaxSetup({async: true});
    }
}

function deletePlayerTableCell(_cellId)
{
    var AccountId = _cellId.substr(10, _cellId.length - 10);
    var playerName = $('#TableCellName_' + AccountId)[0].innerHTML;
    if (confirm('Do you want to remove ' + playerName + ' from alliance?'))
    {
        var WorldId = $('#DropDownListWorld')[0].value;
        var AllianceId = $('#DropDownListAlliance')[0].value;
        var data =
        {
            action: "deletePlayerFromAlliance",
            WorldId: WorldId,
            AllianceId: AllianceId,
            AccountId: AccountId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
        initializeStart();
        prepareSettingsAlliance();
    }
}

function optimizeAllTables()
{
    $('#LoadingSymbol').removeClass('d-none');
    setTimeout(function()
    {
        var data =
        {
            action: "optimizeAllTables"
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
        $('#LoadingSymbol').addClass('d-none');
    }, 50);
}

function deleteServer()
{
    var serverName = $('#DropDownListWorld')[0][$('#DropDownListWorld')[0].selectedIndex].innerHTML;
    if (confirm('Do you want to delete server ' + serverName + ' from database?'))
    {
        var worldId = $('#DropDownListWorld')[0].value;
        var data =
        {
            action: "deleteServer",
            Id: worldId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
        initializeStart();
    }
}

function getAdminLog()
{
    var data=
    {
        action: "getAdminLog"
    }
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        ArrayAdminLog = data;
    });
    $.ajaxSetup({async: true});
}

function prepareAdminLogTable()
{
    var strHtml = '';
    for (var key in ArrayAdminLog)
    {
        ArrayAdminLog[key].Delete =
            '<button class="btn btn-light float-right" onclick="deleteElementAdminLog(\'' + ArrayAdminLog[key].ID + '\')">' +
                '<font color="#FF0000;">' +
                    '<i class="fas fa-times"></i>' +
                '</font>' +
            '</button>';
        strHtml += '<tr>' +
            '<td>' + ArrayAdminLog[key].ID + '</td>' +
            '<td>' + ArrayAdminLog[key].Zeit + '</td>' +
            '<td>' + ArrayAdminLog[key].Initiator + '</td>' +
            '<td>' + ArrayAdminLog[key].Description + '</td>' +
            '<td>' + ArrayAdminLog[key].Delete + '</td>' +
        '</tr>';
    }
    $('#TableAdminLogTbody')[0].innerHTML = strHtml;
    $('#TableAdminLog').DataTable(
        {"order":
            [
                [ 0, "desc" ]
            ]
        }
    );
}

function deleteElementAdminLog(_Id)
{
    $('#TableAdminLog').DataTable().destroy();
    var data=
    {
        action: "deleteElementAdminLog",
        Id: _Id
    }
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data);
    $.ajaxSetup({async: true});
    getAdminLog();
    prepareAdminLogTable();
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

function resetDataTable(_Id, _ArrayRows, _ArrayIdsAndNames, _sort)
{
    if (!$('#' + _Id + '.dataTable')[0])
    {
        if (_sort)
        {
            $('#' + _Id).DataTable({paging: false, order: [[0, "asc"]]});
        }
        else
        {
            $('#' + _Id).DataTable({paging: false, order:[[1]]});
        }
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

function drawDiagrams(_ObjectCur, _NameOfSubObject)
{
    for (var key in _ObjectCur)
    {
        for (var keyDiagramType in ObjectDiagramData[_NameOfSubObject])
        {
            ObjectDiagramData[_NameOfSubObject][keyDiagramType][0][key] = [];
            ObjectDiagramData[_NameOfSubObject][keyDiagramType][0][key].push(_ObjectCur[key][ObjectDiagramData[_NameOfSubObject][keyDiagramType][1][0]]);
            for (var i = 1; i < ObjectDiagramData[_NameOfSubObject][keyDiagramType][1].length - 1 ; i++)
            {
                ObjectDiagramData[_NameOfSubObject][keyDiagramType][0][key].push(parseInt(_ObjectCur[key][ObjectDiagramData[_NameOfSubObject][keyDiagramType][1][i]] * 100) / 100);
            }
        }
    }
    setTimeout(function()
    {
        for (var keyDiagramType in ObjectDiagramData[_NameOfSubObject])
        {
            drawGoogleChartLine(ObjectDiagramData[_NameOfSubObject][keyDiagramType][1], ObjectDiagramData[_NameOfSubObject][keyDiagramType][0]);
        }
    });
}

function createOverviews(_ObjectCur, _nameOfSubObject, _typeOfOverview, _typeOfPlayerData)
{
    if (!ObjectDiagramData[_nameOfSubObject])
    {
        ObjectDiagramData[_nameOfSubObject] = {};
    }
    ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData] = [[], []];
    for (var i = 0; i <= 67; i++)
    {
        ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][1].push(i);
    }
    ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][1].push(_typeOfOverview + ' - ' + _typeOfPlayerData);
    var i = j = 0;
    for (var key in _ObjectCur)
    {
        if (parseInt(_ObjectCur[key]))
        {
            ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0][j] = [];
            ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0][j].push(parseInt(ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][1][i]));
            ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0][j].push(parseInt(_ObjectCur[key]));
            ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0].push(ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0][j]);
            j++;
        }
        i++;
    }
    ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0].pop();
    ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0].unshift(["Level", "Count"]);
}

function drawOverviews(_nameOfSubObject)
{
    setTimeout(function()
    {
        drawGoogleChartColumn(ObjectDiagramData[_nameOfSubObject].Offense[1], ObjectDiagramData[_nameOfSubObject].Offense[0]);
        drawGoogleChartColumn(ObjectDiagramData[_nameOfSubObject].Defense[1], ObjectDiagramData[_nameOfSubObject].Defense[0]);
        drawGoogleChartColumn(ObjectDiagramData[_nameOfSubObject].Support[1], ObjectDiagramData[_nameOfSubObject].Support[0]);
    });
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

function sortTable(_rowId, _tableId, _order)
{
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(_tableId);
    switching = true;
    dir = _order;
    while (switching)
    {
        switching = false;
        rows = table.getElementsByTagName("tr");
        for (i = 1; i < (rows.length - 1); i++)
        {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[_rowId];
            y = rows[i + 1].getElementsByTagName("td")[_rowId];
            if (dir == "desc")
            {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())
                {
                    shouldSwitch= true;
                    break;
                }
            }
            else if (dir == "asc")
            {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())
                {
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch)
        {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++; 
        }
        else
        {
            if (switchcount == 0 && dir == "desc")
            {
                dir = "asc";
                switching = true;
            }
            else if (switchcount == 0 && dir == "asc")
            {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Download
function manageDownloadOfTable(_this)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    switch(_this.id)
    {
        case 'ButtonDownloadPlayerBaseData':
        {
            var PlayerId = $('#DropDownListPlayer')[0].value;
            alasql("SELECT * INTO XLSX('PlayerBaseData.xlsx',{headers:true}) FROM ? ",[ObjectPlayerBaseData[WorldId + '_' + PlayerId]]);
            break;
        }
        case 'ButtonDownloadAlliancePlayerData':
        {
            var AllianceId = $('#DropDownListAlliance')[0].value;
            alasql("SELECT * INTO XLSX('AlliancePlayerData.xlsx',{headers:true}) FROM ? ",[ObjectAlliancePlayerData[WorldId + '_' + AllianceId]]);
            break;
        }
        default:
        {
            break;
        }
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