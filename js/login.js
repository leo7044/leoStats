/* Deceloper: leo7044 */
// (function(){
$(document).ready(function()
{
    $('#FormLogin')[0].onsubmit =
    function()
    {
        return login();
    }
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
// })();