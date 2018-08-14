/* Developer: leo7044 (https://github.com/leo7044) */

function requestBackEnd(_nameOfRequest)
{
    var returnData = null;
    var data =
    {
        action: _nameOfRequest
    };
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        returnData = data;
    });
    $.ajaxSetup({async: true});
    return returnData;
}