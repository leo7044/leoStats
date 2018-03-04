/* Deceloper: leo7044 */
// reason: with "(function(){/* contentOfScript */})();" are no global variables accessable for user, additionally it will be more encrypted
// (function(){
$(document).ready(function()
{
    $('#FormLogin')[0].onsubmit =
    function()
    {
        return login();
    }
    $('#CheckBoxDownloadScript').click(toggleDownloadButtonScript);
});

function login()
{
	var returnValue = false;
    var strForm = $('#FormLogin').serialize();
	var data = 'action=login&' + strForm;
	$.ajaxSetup({async: false});
	$.post('php/manageBackend.php', data)
	.always(function(data)
	{
        if (data[0])
        {
            returnValue = true;
        }
        else
        {
            if (data[1] == 'UserNotInDb')
            {
                $('#FormLoginDivErrorPw').removeClass('d-none');
                $('#ErrorDb').addClass('d-none');
            }
            else
            {
                $('#FormLoginDivErrorPw').addClass('d-none');
                $('#ErrorDb').removeClass('d-none');
            }
        }
    });
	$.ajaxSetup({async: true});
	return returnValue;
}

function toggleDownloadButtonScript()
{
    if ($('#CheckBoxDownloadScript')[0].checked)
    {
        $('#ButtonDownloadScript')[0].disabled = false;
        $('#ButtonDownloadScript')[0].onclick = function()
        {
            window.location.href='js/leostats.min.user.js';
        };
    }
    else
    {
        $('#ButtonDownloadScript')[0].disabled = true;
        $('#ButtonDownloadScript')[0].onclick = function(){};
    }
}
// })();