<?php
/* Developer: leo7044 (https://github.com/leo7044) */
session_start();
if (isset($_REQUEST['logout']))
{
	logout();
}
else if (isset($_SESSION['leoStats_AccountId']))
{
    include_once('html/overview_public.html');
}
else
{
    include_once('html/login_public.html');
}
function logout()
{
	/*unset($_SESSION['leoStats_AccountId']);
	unset($_SESSION['leoStats_UserName']);
	unset($_SESSION['leoStats_IsAdmin']);*/
	session_unset();
	header("LOCATION: /");
}
?>