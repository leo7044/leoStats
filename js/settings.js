/* Developer: leo7044 (https://github.com/leo7044) */

var ObjectNeededMemberRoles= {};

// Player
function validatePassword()
{
    if ($('#InputNewPassword')[0].value != $('#InputConfirmNewPassword')[0].value)
    {
        $('#InputConfirmNewPassword')[0].setCustomValidity("Passwords do not match");
    }
    else
    {
        $('#InputConfirmNewPassword')[0].setCustomValidity('');
    }
}

function changePassword()
{
    var ownAccountId = ObjectSessionVariables.leoStats_AccountId;
    var dataUrl = 'action=changePassword&AccountId=' + ownAccountId + '&' + $('#FormChangePassword').serialize();
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', dataUrl)
    .always(function(data)
    {
        if (data[0])
        {
            $('#PasswordChangeFail').addClass('d-none');
            $('#PasswordChangeSuccess').removeClass('d-none');
            resetFormChangePassword();
        }
        else
        {
            $('#PasswordChangeFail').removeClass('d-none');
            $('#PasswordChangeSuccess').addClass('d-none');
        }
    });
    $.ajaxSetup({async: true});
    return false;
}

function resetFormChangePassword(_forced)
{
    document.forms.FormChangePassword.reset();
    if (_forced)
    {
        $('#PasswordChangeFail').addClass('d-none');
        $('#PasswordChangeSuccess').addClass('d-none');
    }
    $('#InputUserName')[0].value = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML;
}

function resetPlayer()
{
    $('#LoadingSymbolPage').removeClass('d-none');
    setTimeout(function()
    {
        var playerName = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML
        if (confirm('Do you want reset player ' + playerName + '?'))
        {
            var AccountId = $('#DropDownListPlayer').val();
            requestBackEnd('resetPlayer', null, null, AccountId, null, null, null, playerName, null);
        }
        $('#LoadingSymbolPage').addClass('d-none');
    }, 1);
}

function deletePlayer()
{
    $('#LoadingSymbolPage').removeClass('d-none');
    setTimeout(function()
    {
        var playerName = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML
        if (confirm('Do you want to delete player ' + playerName + ' from database?'))
        {
            var AccountId = $('#DropDownListPlayer').val();
            requestBackEnd('deletePlayer', null, null, null, null, null, AccountId, null, null);
            initializeStart();
        }
        $('#LoadingSymbolPage').addClass('d-none');
    }, 1);
}

// Alliance
function getNeededMemberRoles(_WorldId, _AllianceId)
{
    if (!ObjectNeededMemberRoles[_WorldId + '_' + _AllianceId])
    {
        ObjectNeededMemberRoles[_WorldId + '_' + _AllianceId] = requestBackEnd('getNeededMemberRoles', _WorldId, _AllianceId, null, null, null, null, null, null)[0];
    }
    return ObjectNeededMemberRoles[_WorldId + '_' + _AllianceId].MemberRole;
}

function saveChangeNeededMemberRole()
{
    var WorldId = $('#DropDownListWorld').val();
    var AllianceId = $('#DropDownListAlliance').val();
    var MemberRole = $('#DropDownListMemberRole').val();
    var answer = requestBackEnd('changeNeededMemberRole', WorldId, AllianceId, null, null, null, null, null, MemberRole);
    if (answer[0])
    {
        $('#MemberRoleChangeFail').addClass('d-none');
        $('#MemberRoleChangeSuccess').removeClass('d-none');
        ObjectNeededMemberRoles[WorldId + '_' + AllianceId].MemberRole = MemberRole;
    }
    else
    {
        $('#MemberRoleChangeFail').removeClass('d-none');
        $('#MemberRoleChangeSuccess').addClass('d-none');
    }
}

function writeMemberNamesInTable(_WorldId, _AllianceId)
{
    var ArrayPlayerNames = alasql('SELECT DISTINCT AccountId, UserName FROM ? WHERE WorldId="' + _WorldId + '" AND AllianceId="' + _AllianceId + '" ORDER BY UserName' ,[ArrayDropDownListData]);
    for (var i = 0; i < 50; i++)
    {
        if (ArrayPlayerNames[i])
        {
            $('#MemberName' + i)[0].innerHTML = ArrayPlayerNames[i].UserName + '<button class="button light float-right" onclick="deletePlayerFromAlliance(' + _WorldId + ', ' + _AllianceId + ', ' + ArrayPlayerNames[i].AccountId + ', \'' + ArrayPlayerNames[i].UserName + '\');"><font color="#FF0000;"><i class="fas fa-times"></i></font></button>';
        }
        else
        {
            $('#MemberName' + i)[0].innerHTML = '&nbsp;';
        }
    }
}

function deletePlayerFromAlliance(_WorldId, _AllianceId, _AccountId, _PlayerName)
{
    if (confirm('Do you want to remove ' + _PlayerName + ' from alliance?'))
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            requestBackEnd('deletePlayerFromAlliance', _WorldId, _AllianceId, _AccountId, null, null, null, null, null);
            initializeStart();
            writeMemberNamesInTable(_WorldId, _AllianceId);
            $('#LoadingSymbolPage').addClass('d-none');
        }, 1);
    }
}

// Server
function optimizeAllTables()
{
    $('#LoadingSymbolPage').removeClass('d-none');
    setTimeout(function()
    {
        requestBackEnd('optimizeAllTables', null, null, null, null, null, null, null, null);
        $('#LoadingSymbolPage').addClass('d-none');
    }, 1);
}

function deleteServer()
{
    var serverName = $('#DropDownListWorld')[0][$('#DropDownListWorld')[0].selectedIndex].innerHTML;
    if (confirm('Do you want to delete server ' + serverName + ' from database?'))
    {
        $('#LoadingSymbolPage').removeClass('d-none');
        setTimeout(function()
        {
            var WorldId = $('#DropDownListWorld').val();
            requestBackEnd('deleteServer', null, null, null, null, null, WorldId, null, null);
            initializeStart();
            $('#LoadingSymbolPage').addClass('d-none');
        }, 1);
    }
}

function deleteElementAdminLog(_DeleteId)
{
    requestBackEnd('deleteElementAdminLog', null, null, null, null, null, _DeleteId, null, null);
    manageContentSettingsServer(true);
}

// refresh datas
function updateCurrentDatasInView()
{
    var WorldId = $('#DropDownListWorld').val();
    var AllianceId = $('#DropDownListAlliance').val();
    var AccountId = $('#DropDownListPlayer').val();
    var BaseId = $('#DropDownListBase').val();
    switch(getCookie('TabId'))
    {
        case 'TabPlayer':
        {
            ObjectLastIds.Player = {};
            delete ObjectPlayerData[WorldId + '_' + AccountId];
            manageContentPlayer();
            break;
        }
        case 'TabPlayerBase':
        {
            ObjectLastIds.PlayerBase = {};
            delete ObjectPlayerBaseData[WorldId + '_' + AccountId];
            manageContentPlayerBase(_forced);
            break;
        }
        case 'TabAllianceMembers':
        {
            ObjectLastIds.AllianceMembers = {};
            delete ObjectAlliancePlayerData[WorldId + '_' + AllianceId];
            manageContentAllianceMembers(_forced)
            break;
        }
        case 'TabAlliance':
        {
            ObjectLastIds.Alliance = {};
            delete ObjectAllianceData[WorldId + '_' + AllianceId];
            manageContentAlliance();
            break;
        }
        case 'TabAllianceBase':
        {
            ObjectLastIds.AllianceBase = {};
            delete ObjectAllianceBaseData[WorldId + '_' + AllianceId];
            manageContentAllianceBase();
            break;
        }
        case 'TabAllianceOverview':
        {
            ObjectLastIds.AllianceOverview = {};
            delete ObjectAllianceOverviewData[WorldId + '_' + AllianceId];
            manageContentAllianceOverview();
            break;
        }
        case 'TabBase':
        {
            ObjectLastIds.Base = {};
            delete ObjectBaseData[WorldId + '_' + BaseId];
            manageContentBase();
            break;
        }
        case 'TabWorldOverview':
        {
            ObjectLastIds.WorldOverview = {};
            delete ObjectWorldOverviewData[WorldId.toString()];
            manageContentWorldOverview();
            break;
        }
        case 'TabSettingsPlayer':
        {
            ObjectLastIds.SettingsPlayer = {};
            manageContentSettingsPlayer();
            break;
        }
        case 'TabSettingsAlliance':
        {
            ObjectLastIds.SettingsAlliance = {};
            manageContentSettingsAlliance(true);
            break;
        }
        case 'TabSettingsServer':
        {
            manageContentSettingsServer(true);
            break;
        }
        case 'TabSearchPlayer':
        {
            manageContentSearchPlayer();
            break;
        }
        default:
        {
            break;
        }
    }
}

// Search player
function searchPlayer(_PlayerName)
{
    if (_PlayerName)
    {
        var MemberWorldAllianceList = requestBackEnd('getWorldsAndAlliancesByPlayerName', null, null, null, null, null, null, _PlayerName, null);
        var strHtml = '';
        for (var i = 0; i < MemberWorldAllianceList.length; i++)
        {
            strHtml +=
                '<tr>' +
                    '<td>' + MemberWorldAllianceList[i].UserName + '</td>' +
                    '<td>' + MemberWorldAllianceList[i].ServerName + '</td>' +
                    '<td>' + MemberWorldAllianceList[i].AllianceName + '</td>' +
                '</tr>';
        }
        $('#InputPlayerSearchTbody')[0].innerHTML = strHtml;
    }
    else
    {
        $('#InputPlayerSearchTbody')[0].innerHTML = '';
    }
}