/* Developer: leo7044 (https://github.com/leo7044) */

var ObjectPlayerData = {};

function manageContentPlayer()
{
    $('#LoadingSymbolPagePlayer').removeClass('d-none');
    setTimeout(function()
    {
        var WorldId = $('#DropDownListWorld').val();
        var AccountId = $('#DropDownListPlayer').val();
        if (!ObjectPlayerData[WorldId + '_' + AccountId])
        {
            ObjectPlayerData[WorldId + '_' + AccountId] = requestBackEnd('getPlayerData', WorldId, null, AccountId, null);
        }
        var ArrayNeededItems =
        [
            ['Zeit', 'ScorePoints', 'AverageScore'],
            ['Zeit', 'OverallRank'],
            ['Zeit', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits'],
            ['Zeit', 'ResearchPoints', 'Credits'],
            ['Zeit', 'Shoot', 'PvP', 'PvE'],
            ['Zeit', 'BaseD', 'LvLOff', 'OffD', 'DefD', 'DFD', 'SupD'],
            ['Zeit', 'CPMax', 'CPCur'],
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
            ['ChartPlayerCps', 'CPs'],
            ['ChartPlayerFunds', 'Funds']
        ];
        for (var i = 0; i < ArrayNeededItems.length; i++)
        {
            var DataDiagram = prepareDataForChart(ObjectPlayerData[WorldId + '_' + AccountId], ArrayNeededItems[i]);
            drawLineChart(DataDiagram, ArrayDivsAndTitles[i][0], ArrayDivsAndTitles[i][1]);
        }
    }, 50);
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