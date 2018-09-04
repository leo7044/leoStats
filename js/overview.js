/* Developer: leo7044 (https://github.com/leo7044) */

var ObjectSessionVariables = null; // Information about current Session / User
var ArraySeasonServerIds = null; // divide Normal-Server from Veteran-Server
// DropDown
var ArrayDropDownListData = null;
var StartAllianceId = null;
var StartAccountId = null;
var StartBaseId = null;

$(document).ready(function(){
    prepareAdminVsUserView();
    ArraySeasonServerIds = requestBackEnd('getSeasonServerIds', null, null, null, null, null, null, null, null);
    prepareTranslation('overview');
    changeLanguage(getCookie('langIndex'), getCookie('langValue'), 'start', 'overview');
    initializeStart();
});

function prepareAdminVsUserView()
{
    ObjectSessionVariables = requestBackEnd('getSessionVariables', null, null, null, null, null, null, null, null);
    if (!ObjectSessionVariables.leoStats_IsAdmin)
    {
        $('#LiWorldOverview').addClass('d-none');
        $('#LiSettingsServer').addClass('d-none');
        $('#AdminButtonsPlayer').addClass('d-none');
    }
}

function initializeStart()
{
    setCookiesToGlobalVars();
    ArrayDropDownListData = requestBackEnd('getDropDownListData', null, null, null, null, null, null, null, null);
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

function setCookiesToGlobalVars()
{
    StartAllianceId = getCookie('AllianceId');
    StartAccountId = getCookie('AccountId');
    StartBaseId = getCookie('BaseId');
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