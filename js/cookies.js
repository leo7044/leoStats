/* Developer: leo7044 (https://github.com/leo7044) */
function setCookie(_name, _value)
{
    document.cookie = _name + '=' + _value + ';';
}

function getCookie(_name)
{
    var returnValue = '';
    var name = _name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ArrayDecodedCoocie = decodedCookie.split(';');
    for (var i = 0; i < ArrayDecodedCoocie.length; i++)
    {
        var cookieCur = ArrayDecodedCoocie[i];
        while (cookieCur.charAt(0) == ' ')
        {
            cookieCur = cookieCur.substring(1);
        }
        if (cookieCur.indexOf(name) == 0)
        {
            returnValue =  cookieCur.substring(name.length, cookieCur.length);
            break;
        }
    }
    return returnValue;
}