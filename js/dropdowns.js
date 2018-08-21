/* Developer: leo7044 (https://github.com/leo7044) */

function prepareandFillDropDownListDataWorld()
{
    var ArrayDropDownListWorld = alasql('SELECT DISTINCT WorldId, ServerName FROM ? ORDER BY ServerName',[ArrayDropDownListData]);
    var objectSelectOptionsWorld = {};
    for (var i = 0; i < ArrayDropDownListWorld.length; i++)
    {
        objectSelectOptionsWorld[ArrayDropDownListWorld[i].WorldId] = ArrayDropDownListWorld[i].ServerName;
    }
    var DropDownListWorld = $('#DropDownListWorld').data('select');
    DropDownListWorld.data(objectSelectOptionsWorld);
    if (getCookie('WorldId'))
    {
        DropDownListWorld.val(getCookie('WorldId'));
    }
    else
    {
        prepareandFillDropDownListDataAlliance();
    }
}

function prepareandFillDropDownListDataAlliance()
{
    var WorldId = $('#DropDownListWorld').val();
    setCookie('WorldId', WorldId);
    var ArrayDropDownListAlliance = alasql('SELECT DISTINCT AllianceId, AllianceName FROM ? WHERE WorldId="' + WorldId + '" ORDER BY AllianceName' ,[ArrayDropDownListData]);
    var objectSelectOptionsAlliance = {};
    for (var i = 0; i < ArrayDropDownListAlliance.length; i++)
    {
        objectSelectOptionsAlliance[ArrayDropDownListAlliance[i].AllianceId] = ArrayDropDownListAlliance[i].AllianceName;
    }
    var DropDownListAlliance = $('#DropDownListAlliance').data('select');
    DropDownListAlliance.data(objectSelectOptionsAlliance);
    var AllianceValue = alasql('SELECT DISTINCT AllianceId FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownDefaultOwn])[0];
    if (StartAllianceId)
    {
        DropDownListAlliance.val(StartAllianceId);
        StartAllianceId = null;
    }
    else if (AllianceValue)
    {
        DropDownListAlliance.val(AllianceValue.AllianceId);
    }
    else
    {
        prepareandFillDropDownListDataPlayer();
    }
}

function prepareandFillDropDownListDataPlayer()
{
    var WorldId = $('#DropDownListWorld').val();
    var AllianceId = $('#DropDownListAlliance').val();
    setCookie('AllianceId', AllianceId);
    var ArrayDropDownListPlayer = alasql('SELECT DISTINCT AccountId, UserName FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '" ORDER BY UserName' ,[ArrayDropDownListData]);
    var objectSelectOptionsPlayer = {};
    for (var i = 0; i < ArrayDropDownListPlayer.length; i++)
    {
        objectSelectOptionsPlayer[ArrayDropDownListPlayer[i].AccountId] = ArrayDropDownListPlayer[i].UserName;
    }
    var DropDownListPlayer = $('#DropDownListPlayer').data('select');
    DropDownListPlayer.data(objectSelectOptionsPlayer);
    var PlayerValue = alasql('SELECT DISTINCT AccountId FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId +'"' ,[ArrayDropDownDefaultOwn])[0];
    if (StartAccountId)
    {
        DropDownListPlayer.val(StartAccountId);
        StartAccountId = null;
    }
    else if (PlayerValue)
    {
        DropDownListPlayer.val(PlayerValue.AccountId);
    }
    else
    {
        prepareandFillDropDownListDataBase();
    }
}

function prepareandFillDropDownListDataBase()
{
    var WorldId = $('#DropDownListWorld').val();
    var AllianceId = $('#DropDownListAlliance').val();
    var AccountId = $('#DropDownListPlayer').val();
    setCookie('AccountId', AccountId);
    var ArrayDropDownListBase = alasql('SELECT DISTINCT BaseId, Name FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '" AND AccountId="' + AccountId + '" ORDER BY BaseId' ,[ArrayDropDownListData]);
    var objectSelectOptionsBase = {};
    for (var i = 0; i < ArrayDropDownListBase.length; i++)
    {
        objectSelectOptionsBase[ArrayDropDownListBase[i].BaseId] = ArrayDropDownListBase[i].Name;
    }
    var DropDownListBase = $('#DropDownListBase').data('select');
    DropDownListBase.data(objectSelectOptionsBase);
    var isPageStart = false;
    if (StartBaseId)
    {
        DropDownListBase.val(StartBaseId);
        StartBaseId = null;
        isPageStart = true;
    }
    else
    {
        HelpFunctionForChangedBase();
    }
    if($('#LiPlayer.active')[0] && !isPageStart)
    {
        manageContentPlayer();
    }
    else if($('#LiPlayerBase.active')[0] && !isPageStart)
    {
        manageContentPlayerBase();
    }
}

function HelpFunctionForChangedBase()
{
    var BaseId = $('#DropDownListBase').val();
    setCookie('BaseId', BaseId);
}