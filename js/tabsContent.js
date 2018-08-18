/* Developer: leo7044 (https://github.com/leo7044) */

var ObjectPlayerData = {};

function manageContentPlayer()
{
    var WorldId = $('#DropDownListWorld').val();
    var AccountId = $('#DropDownListPlayer').val();
    var ArrayNeededItems = ['Zeit', 'ScorePoints', 'AverageScore'];
    if (!ObjectPlayerData[WorldId + '_' + AccountId])
    {
        ObjectPlayerData[WorldId + '_' + AccountId] = requestBackEnd('getPlayerData', WorldId, null, AccountId, null);
    }
    var DataDiagram = prepareDataForChart(ObjectPlayerData[WorldId + '_' + AccountId], ArrayNeededItems);
    drawLineChart(DataDiagram, 'ChartPlayerScorePoints');
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