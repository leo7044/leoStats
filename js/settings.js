/* Developer: leo7044 (https://github.com/leo7044) */

function optimizeAllTables()
{
    $('#LoadingSymbolPage').removeClass('d-none');
    setTimeout(function()
    {
        requestBackEnd('optimizeAllTables', null, null, null, null, null, null);
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
            requestBackEnd('deleteServer', null, null, null, null, null, WorldId);
            initializeStart();
            $('#LoadingSymbolPage').addClass('d-none');
        }, 1);
    }
}

function deleteElementAdminLog(_DeleteId)
{
    requestBackEnd('deleteElementAdminLog', null, null, null, null, null, _DeleteId);
    manageContentSettingsServer(true);
}