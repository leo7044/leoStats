/* Developer: leo7044 (https://github.com/leo7044) */

var ArrayNotNeeded = ['shuffle', 'clone', 'unique'];
var ObjectPlayerData = {};
var ObjectPlayerBaseData = {};
var ObjectAllianceMembersData = {};
var ObjectAllianceData = {};
var ObjectAllianceBaseData = {};
var ObjectAllianceOverviewData = {};
var ObjectBaseData = {};
var ObjectWorldOverviewData = {};
var ObjectLastIds =
{
    "Player": {},
    "PlayerBase": {},
    "AllianceMembers": {},
    "Alliance": {},
    "AllianceBase": {},
    "AllianceOverview": {},
    "Base": {},
    "WorldOverview": {}
};

function manageContentPlayer()
{
    var WorldId = $('#DropDownListWorld').val();
    var AccountId = $('#DropDownListPlayer').val();
    if (!ObjectPlayerData[WorldId + '_' + AccountId] || ObjectLastIds.Player.WorldId != WorldId || ObjectLastIds.Player.AccountId != AccountId)
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            if (!ObjectPlayerData[WorldId + '_' + AccountId])
            {
                ObjectPlayerData[WorldId + '_' + AccountId] = requestBackEnd('getPlayerData', WorldId, null, AccountId, null);
            }
            if (ArraySeasonServerIds.indexOf(WorldId) == -1)
            {
                var ArrayNeededItems =
                [
                    ['Zeit', 'ScorePoints', 'AverageScore'],
                    ['Zeit', 'OverallRank'],
                    ['Zeit', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits'],
                    ['Zeit', 'ResearchPoints', 'Credits'],
                    ['Zeit', 'Shoot', 'PvP', 'PvE'],
                    ['Zeit', 'BaseD', 'LvLOff', 'OffD', 'DefD', 'DFD', 'SupD'],
                    ['Zeit', 'CPCur', 'CPMax'],
                    ['Zeit', 'Funds']
                ];
                var ArrayDivsAndTitles =
                [
                    ['ChartPlayerScorePoints', 'ScorePoints'],
                    ['ChartPlayerRanking', 'Ranking'],
                    ['ChartPlayerProduction', 'Overall Production'],
                    ['ChartPlayerRpsCredits', 'RPs / Credits'],
                    ['ChartPlayerShoots', 'Shoots'],
                    ['ChartPlayerValues', 'Values'],
                    ['ChartPlayerCps', 'Command-Points'],
                    ['ChartPlayerFunds', 'Funds']
                ];
                $('#ChartPlayerVps, #ChartPlayerLps').addClass('d-none');
            }
            else
            {
                var ArrayNeededItems =
                [
                    ['Zeit', 'ScorePoints', 'AverageScore'],
                    ['Zeit', 'OverallRank', 'EventRank'],
                    ['Zeit', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits'],
                    ['Zeit', 'ResearchPoints', 'Credits'],
                    ['Zeit', 'Shoot', 'PvP', 'PvE'],
                    ['Zeit', 'BaseD', 'LvLOff', 'OffD', 'DefD', 'DFD', 'SupD'],
                    ['Zeit', 'VP'],
                    ['Zeit', 'LP'],
                    ['Zeit', 'CPCur', 'CPMax'],
                    ['Zeit', 'Funds']
                ];
                var ArrayDivsAndTitles =
                [
                    ['ChartPlayerScorePoints', 'ScorePoints'],
                    ['ChartPlayerRanking', 'Ranking'],
                    ['ChartPlayerProduction', 'Overall Production'],
                    ['ChartPlayerRpsCredits', 'RPs / Credits'],
                    ['ChartPlayerShoots', 'Shoots'],
                    ['ChartPlayerValues', 'Values'],
                    ['ChartPlayerVps', 'Veteran-Points'],
                    ['ChartPlayerLps', 'Legacy-Points'],
                    ['ChartPlayerCps', 'Command-Points'],
                    ['ChartPlayerFunds', 'Funds']
                ];
                $('#ChartPlayerVps, #ChartPlayerLps').removeClass('d-none');
            }
            for (var i = 0; i < ArrayNeededItems.length; i++)
            {
                var DataDiagram = prepareDataForLineChart(ObjectPlayerData[WorldId + '_' + AccountId], ArrayNeededItems[i]);
                drawLineChart(DataDiagram, ArrayDivsAndTitles[i][0], ArrayDivsAndTitles[i][1]);
            }
        }, 1);
        ObjectLastIds.Player.WorldId = WorldId;
        ObjectLastIds.Player.AccountId = AccountId;
    }
}

function manageContentPlayerBase(_forced)
{
    var WorldId = $('#DropDownListWorld').val();
    var AccountId = $('#DropDownListPlayer').val();
    if (!ObjectPlayerBaseData[WorldId + '_' + AccountId] || ObjectLastIds.PlayerBase.WorldId != WorldId || ObjectLastIds.PlayerBase.AccountId != AccountId)
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            if (!ObjectPlayerBaseData[WorldId + '_' + AccountId])
            {
                ObjectPlayerBaseData[WorldId + '_' + AccountId] = requestBackEnd('getPlayerBaseData', WorldId, null, AccountId, null);
            }
            var ArrayNeededItems = ['Name', 'LvLCY', 'LvLBase', 'LvLOff', 'LvLDef', 'LvLDF', 'LvLSup', 'SupArt', 'Tib', 'Cry', 'Pow', 'Cre', 'Rep', 'CnCOpt'];
            drawTable(ObjectPlayerBaseData[WorldId + '_' + AccountId], ArrayNeededItems, 'TablePlayerBase', 'BoxViewColsPlayerBase');
        }, 1);
        ObjectLastIds.PlayerBase.WorldId = WorldId;
        ObjectLastIds.PlayerBase.AccountId = AccountId;
    }
    else if (_forced)
    {
        var ArrayNeededItems = ['Name', 'LvLCY', 'LvLBase', 'LvLOff', 'LvLDef', 'LvLDF', 'LvLSup', 'SupArt', 'Tib', 'Cry', 'Pow', 'Cre', 'Rep', 'CnCOpt'];
        drawTable(ObjectPlayerBaseData[WorldId + '_' + AccountId], ArrayNeededItems, 'TablePlayerBase', 'BoxViewColsPlayerBase');
    }
}

function manageContentAllianceMembers(_forced)
{
    var WorldId = $('#DropDownListWorld').val();
    var AllianceId = $('#DropDownListAlliance').val();
    if (!ObjectAllianceMembersData[WorldId + '_' + AllianceId] || ObjectLastIds.AllianceMembers.WorldId != WorldId || ObjectLastIds.AllianceMembers.AllianceId != AllianceId || _forced)
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            if (!ObjectAllianceMembersData[WorldId + '_' + AllianceId])
            {
                ObjectAllianceMembersData[WorldId + '_' + AllianceId] = requestBackEnd('getAlliancePlayerData', WorldId, AllianceId, null, null);
            }
            var ArrayNeededItems = ['UserName', 'Faction', 'Zeit', 'ScorePoints', 'CountBases', 'CountSup', 'OverallRank', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits', 'ResearchPoints', 'Credits', 'Shoot', 'PvP', 'PvE', 'LvLOff', 'BaseD', 'OffD', 'DefD', 'DFD', 'SupD', 'RepMax', 'CPMax', 'CPCur', 'Funds'];
            drawTable(ObjectAllianceMembersData[WorldId + '_' + AllianceId], ArrayNeededItems, 'TableAllianceMembers', 'BoxViewColsAllianceMembers');
        }, 1);
        ObjectLastIds.AllianceMembers.WorldId = WorldId;
        ObjectLastIds.AllianceMembers.AllianceId = AllianceId;
    }
}

function manageContentAlliance()
{
    var WorldId = $('#DropDownListWorld').val();
    var AllianceId = $('#DropDownListAlliance').val();
    if (!ObjectAllianceData[WorldId + '_' + AllianceId] || ObjectLastIds.Alliance.WorldId != WorldId || ObjectLastIds.Alliance.AllianceId != AllianceId)
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            if (!ObjectAllianceData[WorldId + '_' + AllianceId])
            {
                ObjectAllianceData[WorldId + '_' + AllianceId] = requestBackEnd('getAllianceData', WorldId, AllianceId, null, null);
            }
            if (ArraySeasonServerIds.indexOf(WorldId) == -1)
            {
                var ArrayNeededItems =
                [
                    ['Zeit', 'AllianceRank', 'RankTib', 'RankCry', 'RankPow', 'RankInf', 'RankVeh', 'RankAir', 'RankDef'],
                    ['Zeit', 'ScoreTib', 'ScoreCry', 'ScorePow', 'ScoreInf', 'ScoreVeh', 'ScoreAir', 'ScoreDef'],
                    ['Zeit', 'BonusTiberium', 'BonusCrystal', 'BonusPower'],
                    ['Zeit', 'BonusInfantrie', 'BonusVehicle', 'BonusAir', 'BonusDef']
                ];
            }
            else
            {
                var ArrayNeededItems =
                [
                    ['Zeit', 'AllianceRank', 'EventRank', 'RankTib', 'RankCry', 'RankPow', 'RankInf', 'RankVeh', 'RankAir', 'RankDef'],
                    ['Zeit', 'ScoreTib', 'ScoreCry', 'ScorePow', 'ScoreInf', 'ScoreVeh', 'ScoreAir', 'ScoreDef'],
                    ['Zeit', 'BonusTiberium', 'BonusCrystal', 'BonusPower'],
                    ['Zeit', 'BonusInfantrie', 'BonusVehicle', 'BonusAir', 'BonusDef']
                ];
            }
            var ArrayDivsAndTitles =
            [
                ['ChartAllianceRank', 'Ranking'],
                ['ChartAlliancePoints', 'Points'],
                ['ChartAllianceBonusRess', 'Ressources'],
                ['ChartAllianceBonusFight', 'Fight']
            ];
            for (var i = 0; i < ArrayNeededItems.length; i++)
            {
                var DataDiagram = prepareDataForLineChart(ObjectAllianceData[WorldId + '_' + AllianceId], ArrayNeededItems[i]);
                drawLineChart(DataDiagram, ArrayDivsAndTitles[i][0], ArrayDivsAndTitles[i][1]);
            }
        }, 1);
        ObjectLastIds.Alliance.WorldId = WorldId;
        ObjectLastIds.Alliance.AllianceId = AllianceId;
    }
}

function manageContentAllianceBase()
{
    var WorldId = $('#DropDownListWorld').val();
    var AllianceId = $('#DropDownListAlliance').val();
    var type = $('#DropDownAllianceBaseType').val();
    if (!ObjectAllianceBaseData[WorldId + '_' + AllianceId])
    {
        ObjectAllianceBaseData[WorldId + '_' + AllianceId] = {};
    }
    if (!ObjectAllianceBaseData[WorldId + '_' + AllianceId][type])
    {
        ObjectAllianceBaseData[WorldId + '_' + AllianceId][type] = requestBackEnd('getAllianceBaseData', WorldId, AllianceId, null, null, type);
    }
    var curObjectAllianceBaseData = ObjectAllianceBaseData[WorldId + '_' + AllianceId][type];
    buildTableAllianceBase(curObjectAllianceBaseData, type);
}



function manageContentAllianceOverview()
{
    var WorldId = $('#DropDownListWorld').val();
    var AllianceId = $('#DropDownListAlliance').val();
    if (!ObjectAllianceOverviewData[WorldId + '_' + AllianceId] || ObjectLastIds.AllianceOverview.WorldId != WorldId || ObjectLastIds.AllianceOverview.AllianceId != AllianceId)
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            if (!ObjectAllianceOverviewData[WorldId + '_' + AllianceId])
            {
                ObjectAllianceOverviewData[WorldId + '_' + AllianceId] = requestBackEnd('getAllianceOverviewData', WorldId, AllianceId, null, null);
            }
            var ArrayNeededItems = ['LvLOff', 'LvLDef', 'LvLSup'];
            var ArrayDivsAndTitles =
            [
                ['ChartAllianceOverviewOffense', 'Amount Offenselevel'],
                ['ChartAllianceOverviewDefense', 'Amount Defenselevel'],
                ['ChartAllianceOverviewSupport', 'Amount Supportlevel']
            ];
            for (var i = 0; i < ArrayNeededItems.length; i++)
            {
                var DataDiagram = prepareDataForColumnChart(ObjectAllianceOverviewData[WorldId + '_' + AllianceId][i], ArrayNeededItems[i]);
                drawColumnChart(DataDiagram, ArrayDivsAndTitles[i][0], ArrayDivsAndTitles[i][1], 'LvL', 'Amount', '<b>LvL: [[category]]<br/>Amount: [[value]]</b>');
            }
        }, 1);
        ObjectLastIds.AllianceOverview.WorldId = WorldId;
        ObjectLastIds.AllianceOverview.AllianceId = AllianceId;
    }
}

function manageContentBase()
{
    var WorldId = $('#DropDownListWorld').val();
    var BaseId = $('#DropDownListBase').val();
    if (!ObjectBaseData[WorldId + '_' + BaseId] || ObjectLastIds.Base.WorldId != WorldId || ObjectLastIds.Base.BaseId != BaseId)
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            if (!ObjectBaseData[WorldId + '_' + BaseId])
            {
                ObjectBaseData[WorldId + '_' + BaseId] = requestBackEnd('getBaseData', WorldId, null, null, BaseId);
            }
            var ArrayNeededItems =
            [
                ['Zeit', 'Tib', 'Cry', 'Pow', 'Cre'],
                ['Zeit', 'LvLCY', 'LvLBase', 'LvLOff', 'LvLDef', 'LvLDF', 'LvLSup'],
                ['Zeit', 'Rep', 'RepMax']
            ];
            var ArrayDivsAndTitles =
            [
                ['ChartBaseProduction', 'Production'],
                ['ChartBaseValues', 'Values'],
                ['ChartBaseRepairTime', 'Repair-Time in hours']
            ];
            for (var i = 0; i < ArrayNeededItems.length; i++)
            {
                var DataDiagram = prepareDataForLineChart(ObjectBaseData[WorldId + '_' + BaseId], ArrayNeededItems[i]);
                drawLineChart(DataDiagram, ArrayDivsAndTitles[i][0], ArrayDivsAndTitles[i][1]);
            }
            $('#LinkCncOpt')[0].href = ObjectBaseData[WorldId + '_' + BaseId][ObjectBaseData[WorldId + '_' + BaseId].length - 1].CnCOpt;
        }, 1);
        ObjectLastIds.Base.WorldId = WorldId;
        ObjectLastIds.Base.BaseId = BaseId;
    }
}

function manageContentWorldOverview()
{
    var WorldId = $('#DropDownListWorld').val();
    if (!ObjectWorldOverviewData[WorldId] || ObjectLastIds.WorldOverview.WorldId != WorldId)
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            if (!ObjectWorldOverviewData[WorldId])
            {
                ObjectWorldOverviewData[WorldId] = requestBackEnd('getWorldOverviewData', WorldId, null, null, null);
            }
            var ArrayNeededItems = ['LvLOff', 'LvLDef', 'LvLSup'];
            var ArrayDivsAndTitles =
            [
                ['ChartWorldOverviewOffense', 'Amount Offenselevel'],
                ['ChartWorldOverviewDefense', 'Amount Defenselevel'],
                ['ChartWorldOverviewSupport', 'Amount Supportlevel']
            ];
            for (var i = 0; i < ArrayNeededItems.length; i++)
            {
                var DataDiagram = prepareDataForColumnChart(ObjectWorldOverviewData[WorldId][i], ArrayNeededItems[i]);
                drawColumnChart(DataDiagram, ArrayDivsAndTitles[i][0], ArrayDivsAndTitles[i][1], 'LvL', 'Amount', '<b>LvL: [[category]]<br/>Amount: [[value]]</b>');
            }
        }, 1);
        ObjectLastIds.WorldOverview.WorldId = WorldId;
    }
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