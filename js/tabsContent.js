/* Developer: leo7044 (https://github.com/leo7044) */

var ObjectPlayerData = {};
var ObjectPlayerBaseData = {};
var ObjectLastIds =
{
    "Player": {},
    "PlayerBase": {}
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

function manageContentPlayerBase()
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
            drawTable(ObjectPlayerBaseData[WorldId + '_' + AccountId], ArrayNeededItems, 'TablePlayerBase');
        }, 1);
        ObjectLastIds.PlayerBase.WorldId = WorldId;
        ObjectLastIds.PlayerBase.AccountId = AccountId;
    }
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