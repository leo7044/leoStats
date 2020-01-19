/* Developer: leo7044 (https://github.com/leo7044) */
// reason: with "(function(){/* contentOfScript */})();" are no global variables accessable for user, additionally it will be more encrypted
// (function(){

$(document).ready(function(){
    prepareTranslation('login');
    changeLanguage(getCookie('langIndex'), getCookie('langValue'), 'start', 'login');
});

function login()
{
	var returnValue = false;
    var strForm = $(FormLogin).serialize();
	var data = 'action=login&' + strForm;
	$.ajaxSetup({async: false});
	$.post('php/manageBackend.php', data)
	.always(function(data)
	{
        if (data[0])
        {
            $('#ErrorLoginFailed').addClass('d-none');
            $('#ErrorDb').addClass('d-none');
            returnValue = true;
        }
        else
        {
            if (data[1] == 'UserNotInDb')
            {
                $('#ErrorLoginFailed').removeClass('d-none');
                $('#ErrorDb').addClass('d-none');
            }
            else
            {
                $('#ErrorLoginFailed').addClass('d-none');
                $('#ErrorDb').removeClass('d-none');
            }
        }
    });
	$.ajaxSetup({async: true});
	return returnValue;
}
// })();