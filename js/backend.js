/* Developer: leo7044 (https://github.com/leo7044) */

function requestBackEnd(_nameOfRequest, _WorldId, _AllianceId, _AccountId, _BaseId, _type)
{
    var returnData = null;
    var data =
    {
        action: _nameOfRequest,
        WorldId: _WorldId,
        AllianceId: _AllianceId,
        AccountId: _AccountId,
        BaseId: _BaseId,
        type: _type
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