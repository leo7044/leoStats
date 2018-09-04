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
        ObjectNeededMemberRoles[_WorldId + '_' + _AllianceId] = requestBackEnd('getNeededMemberRoles', _WorldId, _AllianceId, null, null, null, null, null, null);
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