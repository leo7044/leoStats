/* Developer: leo7044 (https://github.com/leo7044) */

var ObjectPlayerData = {};
var ObjectPlayerBaseData = {};
var ObjectLastIds =
{
    "Player": {},
    "PlayerBase": {},
    "AllianceMembers": {}
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
                var DataDiagram = prepareDataForChart(ObjectPlayerData[WorldId + '_' + AccountId], ArrayNeededItems[i]);
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
    if (!ObjectPlayerBaseData[WorldId + '_' + AllianceId] || ObjectLastIds.AllianceMembers.WorldId != WorldId || ObjectLastIds.AllianceMembers.AllianceId != AllianceId || _forced)
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            if (!ObjectPlayerBaseData[WorldId + '_' + AllianceId])
            {
                ObjectPlayerBaseData[WorldId + '_' + AllianceId] = requestBackEnd('getAlliancePlayerData', WorldId, AllianceId, null, null);
            }
            var ArrayNeededItems = ['UserName', 'Zeit', 'ScorePoints', 'CountBases', 'CountSup', 'OverallRank', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits', 'ResearchPoints', 'Credits', 'Shoot', 'PvP', 'PvE', 'LvLOff', 'BaseD', 'OffD', 'DefD', 'DFD', 'SupD', 'RepMax', 'CPMax', 'CPCur', 'Funds'];
            drawTable(ObjectPlayerBaseData[WorldId + '_' + AllianceId], ArrayNeededItems, 'TableAllianceMembers', 'BoxViewColsAllianceMembers');
        }, 1);
        ObjectLastIds.AllianceMembers.WorldId = WorldId;
        ObjectLastIds.AllianceMembers.AllianceId = AllianceId;
    }
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