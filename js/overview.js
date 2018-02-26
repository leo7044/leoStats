/* Developer: leo7044 */
// (function(){
var ObjectSessionVariables = {};
var ArraySeasonServerIds = [];
// DropDown
var ArrayDropDownListData = [];
var ArrayDropDownDefaultOwn = [];
// Tabs
var ObjectPlayerData = {};
var ObjectPlayerBaseData = {};
var ObjectAlliancePlayerData = {};
var ObjectAllianceData = {};
var ObjectAllianceOverviewData = {};
var ObjectBaseData = {};
var ObjectWorldOverviewData = {};
// DiagramData
var ObjectDiagramData = {};

$(document).ready(function()
{
    getSessionVariables();
    getSeasonServerIds();
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

// reason: with "(function(){/* contentOfScript */})();" are no global variables accessable for user, additionally it will be more encrypted
function prepairOnClickEvents()
{
    $('#TabPlayer').click(prepareTabPlayer);
    $('#TabPlayerBase').click(prepareTabPlayerBase);
    $('#TabAllianceMembers').click(prepareTabAllianceMembers);
    $('#TabAlliance').click(prepareTabAlliance);
    $('#TabAllianceOverview').click(prepareTabAllianceOverview);
    $('#TabBase').click(prepareTabBase);
    $('#TabWorldOverview').click(prepareTabWorldOverview);
    $('#TabSettings').click(prepareTabSettings);
    $('#DropDownListWorld').change(function(){prepareandFillDropDownListDataAlliance(true);});
    $('#DropDownListAlliance').change(function(){prepareandFillDropDownListDataPlayer(true);});
    $('#DropDownListPlayer').change(function(){prepareandFillDropDownListDataBase(true);});
    $('#DropDownListBase').change(function(){HelpFunctionForChangedBase(true);});
    $('#ButtonOptimizeAllTables').click(optimizeAllTables);
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
        drawGoogleChartColumn(ObjectDiagramData.OverviewAlliance.Off[1], ObjectDiagramData.OverviewAlliance.Off[0]);
    }
    else if ($('#TabWorldOverview.active')[0])
    {
        drawGoogleChartColumn(ObjectDiagramData.OverviewWorld.Off[1], ObjectDiagramData.OverviewWorld.Off[0]);
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
    var ObjectAllianceOverviewCur = ObjectAllianceOverviewData[WorldId + '_' + AllianceId];
    drawOverviews(ObjectAllianceOverviewCur, 'OverviewAlliance', 'Alliance');
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
    drawDiagrams(ObjectBaseCur, 'Base');
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
    var ObjectWorldOverviewCur = ObjectWorldOverviewData[WorldId.toString()];
    drawOverviews(ObjectWorldOverviewCur, 'OverviewWorld', 'World');
}

function manageContentSettings()
{
    if (ObjectSessionVariables.leoStats_IsAdmin)
    {
        $('#v-pills-server-tab').removeClass('d-none');
        $('#AdminButtonsPlayer').removeClass('d-none');
    }
    $('#v-pills-player-tab').addClass('active show');
    $('#v-pills-alliance-tab').removeClass('active show');
    $('#v-pills-server-tab').removeClass('active show');
    $('#v-pills-player').addClass('active show');
    $('#v-pills-alliance').removeClass('active show');
    $('#v-pills-server').removeClass('active show');
    $('#InputUserName')[0].value = $('#DropDownListPlayer')[0].textContent;
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

function drawOverviews(_ObjectCur, _nameOfSubObject, _typeOfOverview)
{
    ObjectDiagramData[_nameOfSubObject] = {};
    ObjectDiagramData[_nameOfSubObject].Off = [[], []];
    for (var i = 0; i <= 67; i++)
    {
        ObjectDiagramData[_nameOfSubObject].Off[1].push(i);
    }
    ObjectDiagramData[_nameOfSubObject].Off[1].push(_typeOfOverview + ' - Offense');
    var i = j = 0;
    for (var key in _ObjectCur)
    {
        if (parseInt(_ObjectCur[key]))
        {
            ObjectDiagramData[_nameOfSubObject].Off[0][j] = [];
            ObjectDiagramData[_nameOfSubObject].Off[0][j].push(parseInt(ObjectDiagramData[_nameOfSubObject].Off[1][i]));
            ObjectDiagramData[_nameOfSubObject].Off[0][j].push(parseInt(_ObjectCur[key]));
            ObjectDiagramData[_nameOfSubObject].Off[0].push(ObjectDiagramData[_nameOfSubObject].Off[0][j]);
            j++;
        }
        i++;
    }
    ObjectDiagramData[_nameOfSubObject].Off[0].pop();
    ObjectDiagramData[_nameOfSubObject].Off[0].unshift(["Level", "Count"]);
    setTimeout(function(){drawGoogleChartColumn(ObjectDiagramData[_nameOfSubObject].Off[1], ObjectDiagramData[_nameOfSubObject].Off[0]);}, 1);
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