/* Developer: leo7044 (https://github.com/leo7044) */

function prepareTabPlayer()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').removeClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentPlayer();
    setCookie('TabId', 'TabPlayer');
}

function prepareTabPlayerBase()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').removeClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentPlayerBase();
    setCookie('TabId', 'TabPlayerBase');
}

function prepareTabAllianceMembers()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').addClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentAllianceMembers();
    setCookie('TabId', 'TabAllianceMembers');
}

function prepareTabAlliance()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').addClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentAlliance();
    setCookie('TabId', 'TabAlliance');
}

function prepareTabAllianceBase()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').addClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentAllianceBase();
    setCookie('TabId', 'TabAllianceBase');
}

function prepareTabAllianceOverview()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').addClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentAllianceOverview();
    setCookie('TabId', 'TabAllianceOverview');
}

function prepareTabBase()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').removeClass('no-visible');
    $('#DivDropDownListBase').removeClass('no-visible');
    manageContentBase();
    setCookie('TabId', 'TabBase');
}

function prepareTabWorldOverview()
{
    $('#DivDropDownListAlliance').addClass('no-visible');
    $('#DivDropDownListPlayer').addClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentWorldOverview();
    setCookie('TabId', 'TabWorldOverview');
}

function prepareTabSettingsPlayer()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').removeClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentSettingsPlayer();
    setCookie('TabId', 'TabSettingsPlayer');
}

function prepareTabSettingsAlliance()
{
    $('#DivDropDownListAlliance').removeClass('no-visible');
    $('#DivDropDownListPlayer').addClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentSettingsAlliance();
    setCookie('TabId', 'TabSettingsAlliance');
}

function prepareTabSettingsServer()
{
    $('#DivDropDownListAlliance').addClass('no-visible');
    $('#DivDropDownListPlayer').addClass('no-visible');
    $('#DivDropDownListBase').addClass('no-visible');
    manageContentSettingsServer();
    setCookie('TabId', 'TabSettingsServer');
}