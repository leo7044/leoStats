<?php
/* Developer: leo7044 (https://github.com/leo7044) */
header("Access-Control-Allow-Origin: *"); // von einer anderen Website drauf zugreifen
// header("Content-Type: application/json; charset=utf-8"); // JSON-Antwort
include_once('config.php'); // Datenbankanbindung
session_start(); // starten der PHP-Session
// $_post = filter_input_array(INPUT_POST); // es werden nur POST-Variablen akzeptiert, damit nicht mittels Link (get-vars) Anderungen an DB vorgenommen werden können
$_get = filter_input_array(INPUT_GET); // es werden nur GET-Variablen akzeptiert
// $_post = replaceChars($_post);
$_get = replaceChars($_get);
$action = $_post['action'];
$action = $_get['action'];
// $UserAnswer = [];
if (!$conn->connect_error)
{
    switch ($action)
    {
        case 'addCnCOptLinks':
        {
            // $result = $conn->query("SELECT Id, PosX, PosY, Layout FROM `layouts` WHERE Id=1 ORDER BY Id ASC;");
            // $result = $conn->query("SELECT Id, PosX, PosY, Layout, CncOpt FROM `layouts` WHERE CncOpt IS null ORDER BY Id ASC;");
            $result = $conn->query("SELECT Id, PosX, PosY, Layout, CncOpt FROM `layouts` WHERE (CncOpt IS null OR CncOpt='') ORDER BY Id ASC;");
            while ($zeile = $result->fetch_assoc())
            {
                $strCncOpt = 'http://cncopt.com/?map=2|N|N|' . $zeile['PosX'] . '_' . $zeile['PosY'] . '|';
                $strLayout = $zeile['Layout'];
                $strLayout = str_replace('[[', '', $strLayout);
                $strLayout = str_replace(']]', '', $strLayout);
                $tmpArray  = explode('],[', $strLayout);
                $arrayLayout = array();
                foreach ( $tmpArray as $k => $v )
                {
                    $arrayLayout[] = explode( ',', $v );
                }
                foreach ($arrayLayout as $key1 => $arrayLayoutRow)
                {
                    foreach ($arrayLayoutRow as $key2 => $arrayLayoutCol)
                    {
                        // echo $arrayLayoutCol . '<br/>';
                        $letterforCncOpt = '.';
                        if ($arrayLayoutCol == '1')
                        {
                            $letterforCncOpt = 'c';
                        }
                        else if ($arrayLayoutCol == '2')
                        {
                            $letterforCncOpt = 't';
                        }
                        $strCncOpt .= $letterforCncOpt;
                    }
                }
                $strCncOpt .= '............................................................................................................|newEconomy';
                echo $strCncOpt . '<br/>';
                $curId = $zeile['Id'];
                $conn->query("UPDATE `layouts` SET `CncOpt`='$strCncOpt' WHERE Id='$curId';");
                // echo $zeile['Layout'];
                // echo $zeile['Id'] . $zeile['Layout'] . '<br/>';
            }
            // $UserAnswer = [1, 'done'];
            break;
        }
    }
}

else
{
    // $UserAnswer = [0, 'no database'];
}
// echo json_encode($UserAnswer);

// ersetzt Sonderzeichen (für schreiben in DB)
function replaceChars($str)
{
	$str = str_replace("\\", "&#92;", $str); // Backslash
	$str = str_replace("'", "&#39;", $str); // einfaches Anführungszeichen
	$str = str_replace("`", "&#96;", $str); // schräges eInfaches Anführungszeichen links (gravis)
	return $str;
}
?>