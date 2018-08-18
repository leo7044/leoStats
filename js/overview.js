/* Developer: leo7044 (https://github.com/leo7044) */

// DropDown
var ArrayDropDownListData = null;
var ArrayDropDownDefaultOwn = null;
var StartAllianceId = null;
var StartAccountId = null;
var StartBaseId = null;

$(document).ready(function(){
    prepareTranslation('overview');
    changeLanguage(getCookie('langIndex'), getCookie('langValue'), 'start', 'overview');
    initializeStart();
});

function setCookiesToGlobalVars()
{
    StartAllianceId = getCookie('AllianceId');
    StartAccountId = getCookie('AccountId');
    StartBaseId = getCookie('BaseId');
}

function initializeStart()
{
    setCookiesToGlobalVars();
    var ArrayDdl = requestBackEnd('getDropDownListData', null, null, null, null);
    ArrayDropDownListData = ArrayDdl[0];
    ArrayDropDownDefaultOwn = ArrayDdl[1];
    prepareandFillDropDownListDataWorld();
    if (getCookie('TabId'))
    {
        $('#' + getCookie('TabId')).click();
    }
    else
    {
        setCookie('TabId', 'TabPlayer');
    }
}