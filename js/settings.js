/* Developer: leo7044 (https://github.com/leo7044) */

function optimizeAllTables()
{
    $('#LoadingSymbolPage').removeClass('d-none');
    setTimeout(function()
    {
        requestBackEnd('optimizeAllTables', null, null, null, null, null);
        $('#LoadingSymbolPage').addClass('d-none');
    }, 1);
}

function deleteServer()
{
    var serverName = $('#DropDownListWorld')[0][$('#DropDownListWorld')[0].selectedIndex].innerHTML;
    if (confirm('Do you want to delete server ' + serverName + ' from database?'))
    {
        var WorldId = $('#DropDownListWorld').val();
        requestBackEnd('deleteServer', WorldId, null, null, null, null);
        initializeStart();
    }
}

function deleteElementAdminLog(_Id)
{
    requestBackEnd('deleteElementAdminLog', null, null, null, null, null, _Id);
    manageContentSettingsServer(true);
}